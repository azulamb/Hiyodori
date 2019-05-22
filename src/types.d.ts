interface DaemonConfig
{
	interval: number;
}

interface ModuleConfig
{
	disable?: boolean;
	name: string;
	module: string;
	args?: any;
	notification: string | string[];
}

interface NotificationData
{
	send: boolean;
	title: string;
	message: string;
}

interface ResultData
{
	message: string;
}

interface ConfigJSON
{
	debug?: boolean;
	daemon?: DaemonConfig;
	useragent?: string;
	scripts?: ModuleConfig[];
	notifications?: { [ key: string ]: any };
	puppeteer?: any;
}
