
export class BaseEvent<T> {
    specversion: string
    type: string
    source: string
    subject: string
    id: string
    time: Date
    comexampleextension1: string
    comexampleothervalue: number
    datacontenttype: string
    data: T
}