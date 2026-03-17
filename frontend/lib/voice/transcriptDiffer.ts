/**
 * Simple transcript diffing logic to show changes between raw and cleaned text.
 */

export interface DiffPart {
    type: 'added' | 'removed' | 'equal';
    value: string;
}

export function diffTranscript(oldText: string, newText: string): DiffPart[] {
    // This is a very basic word-level diff
    // For production, a more robust library like 'diff' would be better
    // But we'll keep it simple for now.

    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);

    const diff: DiffPart[] = [];

    // Basic implementation: if word is in new but not old, it's added
    // If in old but not new, it's removed.
    // This doesn't handle ordering well but serves as a visual hint.

    // For V1, we'll just return the cleaned text as 'added' and original as 'removed'
    // if they are different, or 'equal' if same.

    if (oldText === newText) {
        return [{ type: 'equal', value: oldText }];
    }

    return [
        { type: 'removed', value: oldText },
        { type: 'added', value: newText }
    ];
}
