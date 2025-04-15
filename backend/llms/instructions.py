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
    "Alright, checking out what’s around you.",
    "I’m taking a look at your environment.",
    "One sec — just processing your space.",
    "Let me see what’s going on around you.",
    "Okay, diving into your surroundings now.",
    "I'm on it! Scanning your environment.",
    "Alrighty, checking things out.",
    "Cool — reviewing your surroundings.",
    "Taking a look at the image you sent.",
    "I’m checking out the photo you provided.",
    "On it — reviewing your surroundings.",
    "Let me analyze what’s around you.",
    "Reading your environment now.",
    "I'm processing the data you submitted.",
    "Your environment is under review.",
    "Taking a peek at your surroundings.",
    "Let's see what's happening around you.",
    "I’m checking your space right now.",
    "Looking into your surroundings now.",
    "I’ve got the image — analyzing it now.",
    "Evaluating your environment.",
    "Looking at the world around you.",
    "Dissecting your surroundings as we speak.",
    "Give me a second to check your environment.",
    "I’m taking a moment to scan your input.",
    "Looking through what you just shared.",
    "Analyzing what’s in the picture.",
    "Inspecting your surroundings now.",
    "Examining your environmental input.",
    "Reviewing your latest submission.",
    "Let me check what you’ve just sent.",
    "Scanning the image for context.",
    "Just looking at your environment now.",
    "Going through the visual input you gave.",
    "Pulling up your surroundings now.",
    "Alright — let me check your environment.",
    "Reading your surroundings — hang tight!",
    "Going over your space as we speak."
]
