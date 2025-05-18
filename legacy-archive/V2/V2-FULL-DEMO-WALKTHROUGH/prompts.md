````Markdown
# BMad Hacker Daily Digest LLM Prompts

This document defines the standard prompts used when interacting with the configured Ollama LLM for generating summaries. Centralizing these prompts ensures consistency and aids experimentation.

## Prompt Design Philosophy

The goal of these prompts is to guide the LLM (e.g., Llama 3 or similar) to produce concise, informative summaries focusing on the key information relevant to the BMad Hacker Daily Digest's objective: quickly understanding the essence of an article or HN discussion.

## Core Prompts

### 1. Article Summary Prompt

- **Purpose:** To summarize the main points, arguments, and conclusions of a scraped web article.
- **Variable Name (Conceptual):** `ARTICLE_SUMMARY_PROMPT`
- **Prompt Text:**

```text
You are an expert analyst summarizing technical articles and web content. Please provide a concise summary of the following article text, focusing on the key points, core arguments, findings, and main conclusions. The summary should be objective and easy to understand.

Article Text:
---
{Article Text}
---

Concise Summary:
````

### 2. HN Discussion Summary Prompt

- **Purpose:** To summarize the main themes, diverse viewpoints, key insights, and overall sentiment from a collection of Hacker News comments related to a specific story.
- **Variable Name (Conceptual):** `DISCUSSION_SUMMARY_PROMPT`
- **Prompt Text:**

```text
You are an expert discussion analyst skilled at synthesizing Hacker News comment threads. Please provide a concise summary of the main themes, diverse viewpoints (including agreements and disagreements), key insights, and overall sentiment expressed in the following Hacker News comments. Focus on the collective intelligence and most salient points from the discussion.

Hacker News Comments:
---
{Comment Texts}
---

Concise Summary of Discussion:
```

## Implementation Notes

- **Placeholders:** `{Article Text}` and `{Comment Texts}` represent the actual content that will be dynamically inserted by the application (`src/core/pipeline.ts` or `src/clients/ollamaClient.ts`) when making the API call.
- **Loading:** For the MVP, these prompts can be defined as constants within the application code (e.g., in `src/utils/prompts.ts` or directly where the `ollamaClient` is called), referencing this document as the source of truth. Future enhancements could involve loading these prompts from this file directly at runtime.
- **Refinement:** These prompts serve as a starting point. Further refinement based on the quality of summaries produced by the specific `OLLAMA_MODEL` is expected (Post-MVP).

## Change Log

| Change        | Date       | Version | Description                | Author      |
| ------------- | ---------- | ------- | -------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Initial prompts definition | 3-Architect |
