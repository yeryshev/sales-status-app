const feminizationDictionary: Record<string, string> = {
  отошёл: 'отошла',
  занят: 'занята',
};

export const feminizeWord = (word: string, isFemale: boolean = false) => {
  if (!isFemale) return word;
  return feminizationDictionary[word] || word;
};
