import { ethers } from "ethers";
import dot from 'dotenv'
import { db } from "../db.js";
import schedule from 'node-schedule'
dot.config()

const mnemonic = process.env.MNEMONIC

export const createSubAddress = () => {
    return schedule.scheduleJob('26 * * * *', () => { 
        if (!mnemonic) {
            throw new Error("MNEMONIC is not defined in enviroment variables")
        }

        const masterWallet = ethers.HDNodeWallet.fromPhrase(mnemonic)
        // console.log(masterWallet.address)
    
        const CheckSubAddress = `SELECT COUNT(*) AS count FROM sub_wallet_users WHERE sub_owner = 0`
    
        db.query(CheckSubAddress, (err, data) => {
            if (err) {
                console.log(err)
            }

            const count = data[0].count
            console.log(count)
    
            const CheckIndex = "SELECT * FROM sub_wallet_users ORDER BY sub_id DESC LIMIT 1"
    
            db.query(CheckIndex, (err, data) => {
                if (err) {
                    console.log("error checking index:", err)
                    return
                }
    
                const index = data[0].sub_index
                console.log("current index is:", index)
    
                const sub_wallet_create = 9
                
                if (count <= sub_wallet_create) {
                  for (let i = index + 1; i <= index + 10; i++) {
                    const path = `m/44'/60'/0'/0/${i}`;
                    const subWallet = ethers.HDNodeWallet.fromPhrase(
                      mnemonic,
                      path
                    );
                    // console.log(`Sub address ${i + 1}:`, subWallet.address)
                    // console.log(`PRIVATE KEY ${i + 1}:`, subWallet.privateKey)
    
                    const address = subWallet.address;
                    const key = subWallet.privateKey;
    
                    db.beginTransaction((err) => {
                      if (err) {
                        console.log("Error starting transactions:", err);
                        return db.rollback()
                      }
    
                      const insertQuery =
                        "INSERT INTO sub_wallet_users (`sub_address`, `sub_index`) VALUES (?, ?)";
    
                      const values = [address, i];
    
                      db.query(insertQuery, values, (err, data) => {
                        if (err) {
                          console.log("error inserting:", err);
                          db.rollback();
                        }
    
                        console.log(`inserted ${i} as:`, address);
    
                        const primaryKey = data.insertId;
    
                        const insertKey =
                          "INSERT INTO sub_wallet_key (`sub_w_key`, `sub_w_index`) VALUES (?, ?)";
    
                        const keyValues = [key, primaryKey];
    
                        db.query(insertKey, keyValues, (err, data) => {
                          if (err) {
                            console.log("error inserting key:", err);
                            db.rollback();
                          }
    
                          console.log(`inserted key ${i} as:`, key);
    
                          db.commit((err) => {
                            if (err) {
                              console.log("error committing transaction:", err);
                              db.rollback();
                            }
                          });
                        });
                      });
                    });
                  }
    
                }
            })
        })
    })
    

}
export const forceCreateSubAddress = () => {

        if (!mnemonic) {
            throw new Error("MNEMONIC is not defined in enviroment variables")
        }

        const masterWallet = ethers.HDNodeWallet.fromPhrase(mnemonic)
        // console.log(masterWallet.address)
    
        const CheckSubAddress = `SELECT COUNT(*) AS count FROM sub_wallet_users WHERE sub_owner = 0`
    
        db.query(CheckSubAddress, (err, data) => {
            if (err) {
                console.log(err)
            }
    
            const count = data[0].count
            console.log(count)
    
            const CheckIndex = "SELECT * FROM sub_wallet_users ORDER BY sub_id DESC LIMIT 1"
    
            db.query(CheckIndex, (err, data) => {
                if (err) {
                    console.log("error checking index:", err)
                    return
                }
    
                const index = data[0].sub_index
                console.log("current index is:", index)
    
                const sub_wallet_create = 9
                
                if (count <= sub_wallet_create) {
                  for (let i = index + 1; i <= index + 10; i++) {
                    const path = `m/44'/60'/0'/0/${i}`;
                    const subWallet = ethers.HDNodeWallet.fromPhrase(
                      mnemonic,
                      path
                    );
                    // console.log(`Sub address ${i + 1}:`, subWallet.address)
                    // console.log(`PRIVATE KEY ${i + 1}:`, subWallet.privateKey)
    
                    const address = subWallet.address;
                    const key = subWallet.privateKey;
    
                    db.beginTransaction((err) => {
                      if (err) {
                        console.log("Error starting transactions:", err);
                        return db.rollback()
                      }
    
                      const insertQuery =
                        "INSERT INTO sub_wallet_users (`sub_address`, `sub_index`) VALUES (?, ?)";
    
                      const values = [address, i];
    
                      db.query(insertQuery, values, (err, data) => {
                        if (err) {
                          console.log("error inserting:", err);
                          db.rollback();
                        }
    
                        console.log(`inserted ${i} as:`, address);
    
                        const primaryKey = data.insertId;
    
                        const insertKey =
                          "INSERT INTO sub_wallet_key (`sub_w_key`, `sub_w_index`) VALUES (?, ?)";
    
                        const keyValues = [key, primaryKey];
    
                        db.query(insertKey, keyValues, (err, data) => {
                          if (err) {
                            console.log("error inserting key:", err);
                            db.rollback();
                          }
    
                          console.log(`inserted key ${i} as:`, key);
    
                          db.commit((err) => {
                            if (err) {
                              console.log("error committing transaction:", err);
                              db.rollback();
                            }
                          });
                        });
                      });
                    });
                  }
    
                }
            })
        })
    

}