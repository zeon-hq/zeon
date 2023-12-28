export default function useEmbeddable() {
    const windowLocationArray = window.location.href.split('/');
    const channelId = windowLocationArray[windowLocationArray.length - 1];
    return !!channelId;
}