import { db } from "../db.js";
import jwt from 'jsonwebtoken'

export const withdraw = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Access token is required')
    
    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token expired, Please login again")
    })

    const { partnerId, amount, partnerClass, partnerWithdrawerShare, companyShare, referer, transectionType } = req.body;

    const getReferrerData = (partnerId, callback) => {
        const query = `
          SELECT r.referrerID, cc.Level1Commission, cc.Level2Commission, cc.Level3Commission
          FROM referrals r
          JOIN partners p ON r.referrerID = p.PartnerID
          JOIN CommissionClasses cc ON p.Class = cc.class
          WHERE r.referredID = ?`;
    
        db.query(query, [partnerId], (err, results) => {
          if (err) throw err;
          callback(results);
        });
      };

    const getThirdLevel = (secondId, callback) => {
        const query = `
        SELECT r.referrerID, cc.Level1Commission, cc.Level2Commission, cc.Level3Commission
        FROM referrals r
        JOIN partners p ON r.referrerID = p.PartnerID
        JOIN CommissionClasses cc ON p.Class = cc.class
        WHERE r.referredID = ?`;

        db.query(query, [secondId], (err, data) => {
            if (err) throw err;
            callback(data)
        })
    }

    const insertTransaction = "INSERT INTO transactions (`PartnerID`, `Amount`, `class`, `partner_share`, `company_share`, `referer_share`, `Referrer_one_ID`, `referer_one_commission`, `Referrer_two_ID`, `referer_two_commission`, `Referrer_three_ID`, `referer_three_commission`, `transection_status`, `transection_admin_verified`, `transection_ceo_verified`, `transection_type`) VALUES (?)"

      getReferrerData(partnerId, (referrers) => {
        const data1 = referrers[0];
        let fristRefCom = 0;
        if (data1) {
            // console.log("Data 1",data1);
            console.log("first level")
            fristRefCom = amount * (data1.Level1Commission / 100);

            getReferrerData(referer, (twoRef) => {
                const data2 = twoRef[0];
                let secondRefCom = 0;
                if (data2) {
                    // console.log("Data 2",data2);
                    console.log("second level")
                    secondRefCom = amount * (data2.Level2Commission / 100);
    
                    getThirdLevel(data2.referrerID, (thirdRef) => {
                        const data3 = thirdRef[0];
                        let thirdRefCom = 0;
                        if (data3) {
                            // console.log("Data 3",data3)
                            console.log("third level")
                            thirdRefCom = amount * (data3.Level3Commission / 100);

                            const partnerShare = fristRefCom + secondRefCom + thirdRefCom
                            console.log("Referrers share is", partnerShare)
                            const totalcompanyShare = companyShare - partnerShare
                            console.log("company share  is", totalcompanyShare)
    
                            const values = [
                                partnerId,
                                amount,
                                partnerClass,
                                partnerWithdrawerShare,
                                totalcompanyShare,
                                partnerShare,
                                referer,
                                fristRefCom,
                                data2.referrerID,
                                secondRefCom,
                                data3.referrerID,
                                thirdRefCom,
                                "pending",
                                0,
                                0,
                                transectionType
                            ]
                
                            db.query(insertTransaction, [values], (err, data) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json("interval server error while inserting transaction")
                                }
                                return res.status(200).json("Make request successfully with Ref 3");
                            })
                        } else {

                            const partnerShare = fristRefCom + secondRefCom
                            console.log("Referrers share is", partnerShare)
                            const totalcompanyShare = companyShare - partnerShare
                            console.log("company share  is", totalcompanyShare)
    
                            const values = [
                                partnerId,
                                amount,
                                partnerClass,
                                partnerWithdrawerShare,
                                totalcompanyShare,
                                partnerShare,
                                referer,
                                fristRefCom,
                                data2.referrerID,
                                secondRefCom,
                                null,
                                null,
                                "pending",
                                0,
                                0,
                                transectionType
                            ]
                
                            db.query(insertTransaction, [values], (err, data) => {
                                if (err) {
                                    console.log(err)
                                    return res.status(500).json("interval server error while inserting transaction")
                                }
                                return res.status(200).json("Make request successfully with Ref 2");
                            })
                        }

                    })
                } else {
                    const partnerShare = fristRefCom + secondRefCom 
                    console.log("Referrers share is", partnerShare)
                    const totalcompanyShare = companyShare - partnerShare
                    console.log("company share  is", totalcompanyShare)

                    const values = [
                        partnerId,
                        amount,
                        partnerClass,
                        partnerWithdrawerShare,
                        totalcompanyShare,
                        partnerShare,
                        referer,
                        fristRefCom,
                        null,
                        null,
                        null,
                        null,
                        "pending",
                        0,
                        0,
                        transectionType
                    ]
        
                    db.query(insertTransaction, [values], (err, data) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json("interval server error while inserting transaction")
                        }
                        return res.status(200).json("Make request successfully with Ref 1");
                    })
                }
                // console.log(secondRefCom)
    
            })
        } else {
            const partnerShare = fristRefCom
            console.log("Partner share is", partnerShare)
            const totalcompanyShare = companyShare - partnerShare
            console.log("company share  is", totalcompanyShare)

            const values = [
                partnerId,
                amount,
                partnerClass,
                partnerWithdrawerShare,
                companyShare,
                0,
                null,
                null,
                null,
                null,
                null,
                null,
                "pending",
                0,
                0,
                transectionType
            ]

            db.query(insertTransaction, [values], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json("interval server error while inserting transaction")
                }
                return res.status(200).json("Make request successfully");
            })
        }

    })
    
}

export const deposit = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Access token is required')
    
    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token expired, Please login  again")
    })

    const { partnerId, amount, partnerClass, transectionType } = req.body

    if (!partnerId || !amount || !transectionType) {
        return  res.status(401).json("Please fill in the required")
    }

    const query = "INSERT INTO transactions (`PartnerID`, `Amount`, `class`, `transection_status`, `transection_admin_verified`, `transection_ceo_verified`, `transection_type`) VALUES (?)"

    const values = [
        partnerId,
        amount,
        partnerClass,
        "pending",
        0,
        0,
        transectionType
    ]

    db.query(query, [values], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json("Interval server error");
        }
        return res.status(200).json("Deposit Successfully, Please wait for admin");
    })
}