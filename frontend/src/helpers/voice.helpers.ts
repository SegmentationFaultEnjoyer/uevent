export function say(text: string) {
    const voice = new SpeechSynthesisUtterance(text)

    voice.pitch = 0.5
    voice.lang = 'en'

    window.speechSynthesis.speak(voice)
}