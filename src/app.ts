const form = document.querySelector<HTMLFormElement>('form')!;
const beerTypeInput = document.querySelector<HTMLInputElement>('#beerType')!;
const submitButton = document.querySelector<HTMLButtonElement>('button')!;
const footer = document.querySelector<HTMLElement>('footer');

/* générer la chaine de caractère adéquate pour profiter de l'inteligence
de l'api de façon efficace */
const generatePromptByTypeOfBeer = (beerType) => {
  let prompt = `give me a recipe and advice for a ${beerType} beer!`;
  return prompt;
};

// onload On Search function
const setIsLoading = () => {
  footer!.textContent = "Grab a beer and let's get this recipie started!!!";
  footer?.setAttribute('aria-busy', 'true');
  submitButton.setAttribute('aria-busy', 'true');
  submitButton.disabled = true;
};

// stop onLoad on search function
const stopIsLoading = () => {
  footer!.setAttribute('aria-busy', 'false');
  submitButton.setAttribute('aria-busy', 'false');
  submitButton.disabled = false;
};

form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  setIsLoading();
});
const translateTextToHtml = (text: string) => {
  return text
    .split('\n')
    .map((str) => `<p>${str}</p>`)
    .join('');
};
// use ApiOpenAI
fetch(`https://api.openai.com/v1/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
  body: JSON.stringify({
    prompt: generatePromptByTypeOfBeer(beerTypeInput.value),
    max_tokens: 2000,
    model: 'text-davinci-003',
  }),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    footer.innerHTML = translateTextToHtml(data.choices[0].text);
    console.log(data);
  })
  .finally(() => stopIsLoading());
