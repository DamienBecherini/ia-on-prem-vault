---
title: "🧠 The Journey of a Prompt: How Does an LLM Work?"
description: From your keyboard to the answer. No magic—just electricity and mathematics. Discover the key stages (tokenization, prefill, KV cache, decoding).
sidebar:
  order: 0
---

> [!tip] In brief
> When you send a prompt, the model does not "understand" text—it runs billions of multiplications. This chapter breaks down that journey step by step: tokenization, prefill, KV cache, generation. No prerequisites required.

When you type a question into a local AI model, there is an illusion of magic: the machine seems to "understand" the text and "think" about the answer.

In reality, a processor does not understand French—or any human language. It only executes billions of multiplications at blistering speed. To understand why AI demands so much hardware (and why your PC can feel sluggish), you need to lift the hood and see how text is turned into mathematical computation.

Here is the exact journey of your prompt, step by step.

---

## Step 1: [[00-lexique/tokenisation|Tokenization]] (The text chopper)

A computer can only compute with numbers. The very first step is therefore to split your sentence into chunks called **[[00-lexique/tokenisation|tokens]]**, then assign a number to each chunk.

> [!example] Example
> You type *"Where is Paris?"*
> The model does not see letters; it sees numbers from its internal dictionary. For example: `[4502, 381, 1920, 30]`.

Each model has its own dictionary, learned during training. In 2026, a standard model like **Llama 3** has a vocabulary of roughly **128,256 possible tokens**[^1]. Each number is the exact index of one of those words or subwords.

## Step 2: [[00-lexique/embedding|Embedding]] (The treasure map)

Having the number `4502` for the word "Where" does not help the model grasp its *meaning*.
The machine therefore converts each number into a long list of mathematical coordinates (a vector). This is called **[[00-lexique/embedding|Embedding]]**.

Imagine a 3D map where similar concepts sit close together. The word "King" will be near "Queen" and "Crown." In a large model (LLM), this "map" is not 3-dimensional but often **4,096 or 8,192 dimensions**.

At the end of this step, your short four-word sentence has become a huge grid of thousands of decimal numbers. The real computation can begin.

---

## Step 3: "Prefill" (Ingesting the context)

This is where the inference engine (the software running the AI) launches its heaviest work. The model passes your grid of numbers through dozens of artificial neural network "layers."

This phase is called [[00-lexique/prefill|Prefill]]. The model **reads your entire prompt at once**, in parallel.

The heart of this step is the **[[00-lexique/attention|Attention]] mechanism**: the model cross-relates every word to understand context. It mathematically determines that, in your sentence, the question mark is strongly linked to the word "Where."
* **What happens in the machine:** Your chips (CPU or GPU) run at 100% of their compute capacity (TFLOPS) because they can execute all those matrix multiplications simultaneously.

## Step 4: KV Cache (Short-term memory)

During Prefill, the model computed the importance and context of each word in your history. If it had to recompute all of that for every new word it generates, it would be painfully slow.

To avoid that, it saves all those intermediate results in your graphics card's [[00-lexique/vram|VRAM]]. This is the famous **[[00-lexique/kv-cache|KV Cache]]** (Key-Value Cache).
The longer your prompt (e.g., if you give it a 200-page PDF to read), the larger this KV cache grows and the more it saturates your machine's memory.

---

## Step 5: "Decoding" (Word-by-word generation)

Now that the model has "digested" your question and stored context in the KV cache, it produces its answer. **It does so one token at a time.** This is the [[00-lexique/decoding|Decoding]] phase.

1. The model looks at your prompt, looks at its KV cache, and mathematically predicts that the most probable word to start the answer is *"Paris"*.
2. It writes *"Paris"*.
3. **The cycle repeats:** it takes your prompt + the word *"Paris"*, re-reads the KV cache, and computes that the next word is *"is"*.
4. It writes *"is"*.

This loop continues until the model generates a special token that means `<END>`.

* **What happens in the machine:** This is a highly sequential phase. The processor must constantly shuttle data to and from memory to fetch model weights and the KV cache, just to generate a single token. That is why generation speed depends on **[[01-fondations/memory-bandwidth|Memory Bandwidth]]** rather than raw compute power alone.

---

## 🎯 Summary for the architect

When a user complains that *"the AI is slow,"* you need to know which phase they mean:
* **Takes too long to get started?** That is **Prefill**. The processor lacks raw compute (TFLOPS) to digest the initial prompt, or the context sent is too long.
* **Writes the answer too slowly?** That is **Decoding**. The machine hits the "memory wall": the graphics card memory cannot feed the chip fast enough to compute the next token.

> [!tip] Next step
> Now that you understand Decoding is limited by memory speed, continue to the chapter on [[01-fondations/memory-bandwidth|Memory Bandwidth]].

## 📚 Sources and References
[^1]: Meta, *Llama 3.1 Model Card* (Architecture, vocabulaire 128 256 tokens, tokenizer Tiktoken), 2024. [GitHub — llama-models](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md)
