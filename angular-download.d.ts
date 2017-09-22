import * as angular from "angular";

declare module "angular" {
	export interface IDownloadService {
		fromData(data: string, mimeType: string, name: string);
		fromBase64(dataBase64: string, mimeType: string, name: string);
		fromDataURL(dataUrl: string, name: string);
		fromBlob(dataBlob: Blob, name: string);
	}
}
