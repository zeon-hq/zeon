export interface IEmbeddableOutput {
    isEmbeddable?: boolean;
    channelId?: string;
}
export default function useEmbeddable():IEmbeddableOutput {
    const windowLocationArray = window.location.href.split('/');
    const channelId = windowLocationArray[windowLocationArray.length - 1];
    return {isEmbeddable:!!channelId, channelId};
}