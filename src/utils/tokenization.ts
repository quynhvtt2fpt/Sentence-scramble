/**
 * Tokenize a sentence string into individual clean word cards,
 * keeping contractions intact (e.g. "don't", "I'm") and stripping
 * leading/trailing punctuation marks for clean floating cards.
 */
export function tokenizeSentence(sentence: string): string[] {
  if (!sentence || !sentence.trim()) return [];

  // Split sentence by whitespace
  const rawWords = sentence.trim().split(/\s+/);

  const tokens: string[] = [];

  for (const rawWord of rawWords) {
    // Strip leading and trailing punctuation except internal apostrophes/hyphens
    // e.g. "apples," -> "apples", "school." -> "school", "(book)" -> "book"
    // "don't" -> "don't"
    const cleaned = rawWord.replace(/^[^\w\d']+|[^\w\d']+$|\.+$|,+$|\?+$|!+$|;+$|:+$|"+|'+$/g, '');

    if (cleaned.length > 0) {
      tokens.push(cleaned);
    } else if (rawWord.length > 0) {
      // Fallback if the word was purely punctuation
      tokens.push(rawWord);
    }
  }

  return tokens;
}

/**
 * Fisher-Yates Shuffle with check to ensure shuffled order is not identical to original
 */
export function shuffleTokens(tokens: string[]): string[] {
  if (tokens.length <= 1) return [...tokens];

  let shuffled = [...tokens];
  let attempts = 0;

  while (attempts < 10) {
    shuffled = [...tokens];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Check if shuffled order is different from original
    const isSame = shuffled.every((val, idx) => val === tokens[idx]);
    if (!isSame) {
      break;
    }
    attempts++;
  }

  return shuffled;
}

/**
 * Clean up sentence whitespace for display
 */
export function formatAnswerSentence(sentence: string): string {
  return sentence.trim().replace(/\s+/g, ' ');
}
