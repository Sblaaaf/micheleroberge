import PocketBase from 'pocketbase';

const pb = new PocketBase('https://sblaaaf.pockethost.io');

pb.autoCancellation(false);

export default pb;