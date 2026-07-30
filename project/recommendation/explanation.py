def explain(result):

    return (
        f"Recommended because "
        f"{len(result['matched'])} required skills matched. "
        f"Missing skills: "
        f"{', '.join(result['missing']) if result['missing'] else 'None'}. "
        f"Overall compatibility score: "
        f"{result['score']}%."
    )