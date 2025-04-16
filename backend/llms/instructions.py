recipe_instructions = "You are a friendly, helpful recipe generator that only generates recipes."

preamble_instructions = "Let the user know their surroundings (an image input) are being processed. " \
                        + "Do not ask any follow-up questions or prompt the user for more input."
                        
realtime_instructions = "You are a friendly, helpful kitchen assistant." \
                    + "The image you receive may not be relevant to the prompt." \
                    + "If that is the case, ignore the image."
                    
gate_instructions = (
    "You are a binary classifier. "
    "You will receive a [user_request] and an [assistant_response]"
    "If the [assistant_response] fulfills the [user_request], output 'sufficient'. "
    "Otherwise, output 'needs_follow_up'. "
    "Output ONLY 'needs_follow_up' or 'sufficient'.\n"
)

processing_phrases = [
    "I'm analyzing your surroundings now.",
    "Processing the environment you shared.",
    "I've received your input — analyzing now.",
    "Beginning to process your surroundings.",
    "I'm working on your environmental data.",
    "Your surroundings are being processed.",
    "I'm currently reviewing what you sent.",
    "Analyzing the image you provided.",
    "Scanning your environment now.",
    "Reviewing your surroundings at the moment.",
    "Got it! Looking at your surroundings now.",
    "Alright, checking out what's around you.",
    "I'm taking a look at your environment.",
    "One sec — just processing your space.",
    "Let me see what's going on around you.",
    "Okay, diving into your surroundings now.",
    "I'm on it! Scanning your environment.",
    "Alrighty, checking things out.",
    "Cool — reviewing your surroundings.",
    "Taking a look at the image you sent.",
    "I'm checking out the photo you provided.",
    "On it — reviewing your surroundings.",
    "Let me analyze what's around you.",
    "Reading your environment now.",
    "I'm processing the data you submitted.",
    "Your environment is under review.",
    "Taking a peek at your surroundings.",
    "Let's see what's happening around you.",
    "I'm checking your space right now.",
    "Looking into your surroundings now.",
    "I've got the image — analyzing it now.",
    "Evaluating your environment.",
    "Looking at the world around you.",
    "Dissecting your surroundings as we speak.",
    "Give me a second to check your environment.",
    "I'm taking a moment to scan your input.",
    "Looking through what you just shared.",
    "Analyzing what's in the picture.",
    "Inspecting your surroundings now.",
    "Examining your environmental input.",
    "Reviewing your latest submission.",
    "Let me check what you've just sent.",
    "Scanning the image for context.",
    "Just looking at your environment now.",
    "Going through the visual input you gave.",
    "Pulling up your surroundings now.",
    "Alright — let me check your environment.",
    "Reading your surroundings — hang tight!",
    "Going over your space as we speak."
]

longer_processing_phrases = [
    "I hear you loud and clear! Give me just a moment while I take a look at your surroundings.",
    "Got your input! I'm taking a quick moment to scan your environment and process everything you shared.",
    "Thanks for that — I'm reviewing what's around you right now, so hang tight while I work through it.",
    "Alright, I've received your voice and surroundings. Let me go ahead and process that for you.",
    "Let me take a closer look at what you've just sent in. I'll be ready with a response shortly.",
    "Got it! I'm taking a moment to analyze your voice and environment so I can help you out properly.",
    "I'm going through your audio and the image you sent — sit tight while I figure out what's going on.",
    "I appreciate the input. Just a moment while I scan your surroundings and get everything lined up.",
    "Thanks for sharing that! I'm checking out the scene and working on a response for you.",
    "Hold tight — I'm examining what you've just sent and getting things ready on my end.",
    "Alright, I'm reviewing your surroundings and voice input now. I'll have something for you soon.",
    "Perfect, I've got everything I need. I'm just processing your environment before continuing.",
    "Thanks — I'm loading up your image and taking a moment to make sure I understand the full picture.",
    "Great, I'm looking at your space now and preparing the right response. One moment.",
    "Okay! I'm analyzing the image and your voice input to come up with the next step.",
    "I see what you're asking, and I'm just processing your environment so I can respond properly.",
    "Sounds good — let me go through what you've provided and I'll get right back to you.",
    "Understood. I'll take a moment to scan the image and process what you said.",
    "You've submitted both voice and visual input — I'm reviewing that now, just a sec.",
    "Thanks for your input! I'm processing the surroundings you captured so I can help further."
]

