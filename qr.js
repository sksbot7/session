const axios = require('axios');
const { create } = require('./session');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    Browsers,
    delay,
    makeInMemoryStore,
} = require("@whiskeysockets/baileys");

const { readFile } = require("node:fs/promises")

let router = express.Router()

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    })
};

router.get('/', async (req, res) => {
    const id = makeid();
    async function Getqr() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id)
        try {
            let session = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({
                    level: "silent"
                }),
                browser: ["WhatsApp-Bot", "Edge", "136.0.3240.64"],
            });

            session.ev.on('creds.update', saveCreds)
            session.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                if (qr) await res.end(await QRCode.toBuffer(qr));
                if (connection == "open") {
                    await delay(5000);
                    await delay(5000);

                    const jsonData = await fs.promises.readFile(`${__dirname}/temp/${id}/creds.json`, 'utf-8');
                    const { id: data } = await create(jsonData);
                    await session.sendMessage(session.user.id, { text: 'WhatsApp-Bot~' + data });

                    await delay(100);
                    await session.ws.close();
                    return await removeFile("temp/" + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    Getqr();
                }
            });
        } catch (err) {
            if (!res.headersSent) {
                await res.json({
                    code: "Service Unavailable"
                });
            }
            console.log(err);
            await removeFile("temp/" + id);
        }
    }
    return await Getqr()
});

module.exports = router;
