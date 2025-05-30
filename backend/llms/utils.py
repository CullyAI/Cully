from configs.diseases import diseases

####################
### Instructions ###
####################

recipe_instructions = "You are a friendly, helpful recipe generator that only generates recipes."

macros_instructions = (
    "You are a macro calculator. The user will give you their age, sex, height, weight, activity level, "
    "and target weight. "
    "Respond in the following JSON format ONLY:\n\n"
    "{\n"
    "  \"calories\": int,                  # suggested daily calorie intake\n"
    "  \"macros\": {\n"
    "    \"protein_g\": int,               # grams of protein per day\n"
    "    \"carbs_g\": int,                 # grams of carbohydrates per day\n"
    "    \"fat_g\": int                    # grams of fat per day\n"
    "  },\n"
    "  \"meals_per_day\": int              # suggested number of meals to split macros into\n"
    "}\n\n"
    "Only output this JSON object — no explanations or extra text."
)
                        
realtime_instructions = (
    "You are a friendly, helpful kitchen voice assistant. "
    "Your outputs should be able to be read out loud. This means no abbreviations. "
    "You CAN hear the user and you CAN see images of their surroundings."
)   
                        
audio_only_instructions = (
    "You are a friendly, helpful kitchen voice assistant. "
    "You CAN hear the user and you CAN see images. "
    "Your outputs should be able to be read out loud. This means no abbreviations. "
    "If the user is asking a question that clearly requires visual information, "
    "let them know that you can see, but they should enable their camera. "
)

recipe_detail_instructions = (
    "Given a recipe, respond in the following JSON format ONLY:\n\n"
    "{\n"
    "  \"title\": str,\n"
    "  \"description\": str,\n"
    "  \"steps\": str (separated by newlines),\n"
    "  \"preparation_time\": int,\n"
    "  \"cooking_time\": int,\n"
    "  \"difficulty_level\": int (1.0-5.0),\n"
    "  \"calories\": float,\n"
    "  \"protein\": float,\n"
    "  \"carbs\": float,\n"
    "  \"fat\": float\n"
    "}\n\n"
    "Respond ONLY with a valid JSON object and no extra commentary.\n\n"
    "If the input is not a recipe, then respond with the string \"False\" (in quotes)."
)



tts_instructions = (
    "Be warm and friendly."
)

pauses = ["!", ".", "?", ":", "\n", "\n\n"]
    

########################
### Building Prompts ###
########################

def user_info_prompt(user_row, recipe={}):
    user_diseases = [d.strip() for d in user_row.diseases.split(",") if d.strip()]
    restrictions = [diseases[d] for d in user_diseases if d in diseases]
    disease_restrictions = ""
    
    if restrictions:
        disease_restrictions = ", ".join(restrictions[:-1]) + f", and {restrictions[-1]}"
    
    disease_string = (
        f"The user has {user_row.diseases}, and thus requires {disease_restrictions}.\n"
        if user_row.diseases else ""
    )
    
    allergies_string = (
        f"Here are the user's allergies: {user_row.allergies}.\n"
        if user_row.allergies else ""
    )
    
    preferences_string = (
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}.\n"
        if user_row.dietary_preferences else ""
    )
    
    goals_string = (
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}.\n"
        if user_row.nutritional_goals else ""
    )

    macro_string = ""
    if user_row.macros:
        macros = user_row.macros
        macro_string = (
            "The user has the following macro targets:\n"
            f"- Calories: {macros.get('calories', 'N/A')}\n"
            f"- Protein: {macros.get('protein', 'N/A')}g\n"
            f"- Carbs: {macros.get('carbs', 'N/A')}g\n"
            f"- Fat: {macros.get('fat', 'N/A')}g\n"
            f"- Meals per day: {macros.get('meals_per_day', 'N/A')}\n"
        )
        
    recipe_string = (
        f"The user is working on the following recipe: {recipe.get('title')}\n"
        f"These are the steps: {recipe.get('steps')}\n"
        if recipe else ""
    )

    user_info = (
        disease_string +
        allergies_string +
        preferences_string +
        goals_string +
        macro_string +
        recipe_string
    )
    
    return user_info


def macro_info_prompt(age, sex, height, weight, activity_level, target_weight, other_info):
    prompt = (
        f"Age: {age}\n"
        f"Sex: {sex}\n"
        f"Height: {height} in.\n"
        f"Current Weight: {weight} lbs\n"
        f"Workout Frequency: {activity_level} times/week\n"
        f"Target Weight: {target_weight} lbs\n"
        f"Other Info: {other_info}"
    )
    
    return prompt

#############
### Other ###
#############

def background_job(holder: dict, func, *args, **kwargs):
    """Run *func* in a background thread/green-thread and stash the result."""
    holder["value"] = func(*args, **kwargs)