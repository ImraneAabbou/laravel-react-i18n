import ReplacementsInterface from '../interfaces/replacements';
import { isValidElement, ReactNode } from 'react';

/**
 * Make the place-holder replacements on a line.
 *
 * @param message
 * @param replacements
 */
export default function replacer(message: string, replacements?: ReplacementsInterface): ReactNode[] {
  if (!replacements) return [message];

  const keys = [...new Set(Object.keys(replacements))];

  const regex = new RegExp(`(:${keys.join('|:')})`, 'gi');


  const parts = message.split(regex).filter(Boolean);

  const replaced = parts.reduce<ReactNode[]>((acc, p) => {
    const placeholder = p;
    const label = p.slice(1);
    if (!placeholder.startsWith(':') || !keys.map((k) => k.toLowerCase()).includes(label.toLowerCase()))
      return [...acc, placeholder];

    if (replacements[label]) return [...acc, replacements[label]];

    if (label.toUpperCase() === label) {
      const replacement = replacements[label.toLowerCase()]!;
      return [...acc, replacement.toString().toUpperCase()];
    }

    if (label.charAt(0).toUpperCase() === label.charAt(0)) {
      const replacement = replacements[label.toLowerCase()]!;
      return [...acc, capitalize(replacement.toString())];
    }

    const replacement = replacements[label.toLowerCase()]!;
    if (isValidElement(replacement)) {
      return [...acc, replacement];
    }

    return [...acc, replacement.toString()];
  }, []);

  return replaced;
}

/**
 * Capitalizing string.
 *
 * @param str
 */
function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}
