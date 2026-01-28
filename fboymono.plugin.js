/**
 * @name FuckboyMono
 * @version 1.0
 * @author DaddyKaze
 * @authorId 1461756942941950105
 * @website https://discord.gg/KcJtS89VxD
 * @source https://raw.githubusercontent.com/zashirax/fboymono/refs/heads/main/FuckboyMono.plugin.js
 * @description gets u on mono sound
 */

module.exports = class FuckboyMono {
    constructor() {
        this.config = {
            info: {
                name: "Fuckboy Mono",
                author: "Daddy Z/Cumikaze",
                version: "1",
            },
            defaultConfig: []
        }

        this.fuckboy = new WeakSet();
    }

    start() {
        this.warn();
        const voiceModule = BdApi.Webpack.getModule(m => m?.prototype?.setRemoteVideoSinkWants);
        if (!voiceModule) {
            return;
        };
        BdApi.Patcher.after("FuckboyMono", voiceModule.prototype, "setRemoteVideoSinkWants", (thisObj, _args, ret) => {
            if (thisObj?.conn && !this.fuckboy.has(thisObj.conn)) {
                this.fuckboy.add(thisObj.conn);
                BdApi.Patcher.before("FuckboyMono", thisObj.conn, "setTransportOptions", (_thisObj, args) => {
                    const options = args[0]
                    if(!options) {
                        return;
                    }
                    if(options.audioEncoder) {
                        options.audioEncoder.params = {
                            mono: "1"
                        }
                        options.audioEncoder.channels = 1
                    }
                    if(options.fec) {
                        options.fec = false;
                    }
                    if(options.encodingVoiceBitRate < 960000) {
                        options.encodingVoiceBitRate = 384000;
                    }
                    if(options.SetInputVolume) {
                        options.SetInputVolume = 1000;
                    }
                })
            }
            return ret;
        }) 
    }

    warn() {
        const voiceSettingsStore = BdApi.Webpack.getModule(m => typeof m?.getEchoCancellation === "function");
        if(!voiceSettingsStore){
            return;
        }
        if(voiceSettingsStore) {
            var noisesupp = voiceSettingsStore.getNoiseSuppression();
            var noisecancel = voiceSettingsStore.getNoiseCancellation();
            var echocancel = voiceSettingsStore.getEchoCancellation();
            if (noisesupp || noisecancel || echocancel) {
                 BdApi.UI.showToast("🤬 Fix Your Voice Settings Dumbass, Disable [NoiseSuppression, NoiseCancellation, EchoCancellation] To Get Fuckable",
                        {
                            type: "warning",
                            timeout: 5000
                        }
                    )
            } else {
                BdApi.UI.showToast("👍🏻 Fuckboy set on 1 channel")
            }
        }
    }
    stop() {
        BdApi.Patcher.unpatchAll();
        this.fuckboy = new WeakSet();
    }
};
