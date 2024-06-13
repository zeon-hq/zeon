//@ts-ignore
import words from "lodash.words"
//@ts-ignore
import emoji from "emoji-dictionary"

function urlify(text:string) {
  const urlRegex = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  const allText = (text || '').split(" ") || []
  let modifiedText = ""

  allText.forEach((word, index) => {
    if(word[0] === "<"  && word[word.length - 1] === ">") {
      word = word.replace("<", "").replace(">", "")
    }
    if(urlRegex.test(word)){
      // if word has "|", then split it and take the first part
      if(word.includes("|")) {
        word = word.split("|")[0]
      }
      // Remove trailing period if it exists
      if(word.endsWith(".")) {
        word = word.slice(0, -1);
      }
      modifiedText += ` [${word}](//${word}) `
    } else {
      modifiedText += ` ${word}`
    }
  })
  return modifiedText
}

const replaceUserstakVariables = (str:string,obj:any) => {
  // get array
  const arr = str.split(" ")
  let finalString = ""
  arr.forEach((word, index) => {
    // if word has "{" at the first index and "}" at the last index then replace it with the value
    if(word[0] === "{" && word[word.length - 1] === "}") {
      const key = word.replace("{", "").replace("}", "")
      if(key === "useremail") {
        finalString += `${obj.email} `
      }
    } else {
      finalString += `${word} `
    }

  })

  return finalString


}

export const preProcessText = (str:string, obj:any) => {
  
    
    const check = words(str,/:(.*?):/g)
    check.forEach((word:string) => {
      const a = str.replaceAll(word, emoji.getUnicode(word))
      str = a
    })
    // let finalString = urlify(str)
    let finalString = replaceUserstakVariables(str,obj)

    return finalString
  }

  export function generateRandomString(length: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
    return randomString;
  }