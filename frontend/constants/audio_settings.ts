export const MICRO_AUDIO = {
    ios: {
        extension: '.wav',
        audioQuality: 32,
        sampleRate: 8000,
        numberOfChannels: 1,
        bitRate: 16000, 
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },   
    android: {
      extension: '.amr', // Raw AMR-NB without container
      outputFormat: 1, // THREE_GPP
      audioEncoder: 4, // AMR-NB
      sampleRate: 8000,
      bitRate: 4750, // Lowest AMR tier (4.75 kbps)
    },
    web: {
      mimeType: 'audio/ogg; codecs=speex', // Speex at 8kbps
      bitsPerSecond: 8000,
    }
};