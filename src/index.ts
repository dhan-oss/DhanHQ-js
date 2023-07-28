import {Base} from "./base";
import {applyMixins} from "./utils";
import {RestClient} from "./rest-client";

class DhanHqClient extends Base {
}

interface DhanHqClient extends RestClient {
}

applyMixins(DhanHqClient, [RestClient]);

export {DhanHqClient as DhanHqClient};

export * from './types'
