import requests
from core.llm import ask_claude

def search_literature(risk_scores: dict) -> dict:
    """
    Identifies the highest risk disease, queries PubMed for 5 recent abstracts 
    related to its prevention, and uses the LLM to extract proven interventions.
    """
    # 1. Identify the highest risk disease
    highest_risk_disease = max(risk_scores, key=risk_scores.get)
    
    # 2. Call PubMed API (ESearch) to get 5 recent article IDs
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    search_params = {
        "db": "pubmed",
        "term": f"{highest_risk_disease} prevention[Title/Abstract]",
        "retmax": 5,
        "retmode": "json",
        "sort": "pub_date" # Fetch the latest available evidence
    }
    
    try:
        search_resp = requests.get(search_url, params=search_params, timeout=10)
        search_data = search_resp.json()
        article_ids = search_data.get("esearchresult", {}).get("idlist", [])
    except Exception:
        article_ids = []

    abstracts = ""
    
    # 3. Call PubMed API (EFetch) to get the actual text of the abstracts
    if article_ids:
        fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        fetch_params = {
            "db": "pubmed",
            "id": ",".join(article_ids),
            "rettype": "abstract",
            "retmode": "text"
        }
        try:
            fetch_resp = requests.get(fetch_url, params=fetch_params, timeout=15)
            abstracts = fetch_resp.text
        except Exception:
            abstracts = "Could not fetch abstracts from PubMed."
    else:
        abstracts = "No relevant articles found in recent literature."

    # 4. Use LLM to extract and synthesize interventions from the raw abstracts
    system_prompt = (
        "You are an expert medical researcher. Review the provided PubMed abstracts "
        "and extract the top evidence-based prevention strategies for the target disease. "
        "Format the output as a clear list of proven interventions. If effect sizes or "
        "statistical impacts (e.g., 'reduced risk by 20%') are mentioned in the text, "
        "you must include them. If the abstracts are missing or unhelpful, provide standard, "
        "evidence-based clinical interventions for the disease."
    )
    
    user_msg = (
        f"Target Disease: {highest_risk_disease.capitalize()}\n\n"
        f"Raw PubMed Abstracts:\n{abstracts[:4000]}" # Truncated to stay well within token limits
    )
    
    evidence = ask_claude(system_prompt, user_msg)
    
    return {
        "highest_risk_disease": highest_risk_disease,
        "evidence": evidence
    }