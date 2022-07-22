import en from "./en"
import ptBR from "./pt-BR"

export const GetError = (errorCode: string, lang?: string) => {
    switch (lang) {
        case "pt-BR":
            if (ptBR[errorCode])
                return ptBR[errorCode]
            else
                return en[errorCode]

        default:
            return en[errorCode]
    }
}