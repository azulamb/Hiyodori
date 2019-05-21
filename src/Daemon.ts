export default class Daemon
{
	private config: DaemonConfig;

	constructor( config: ConfigJSON )
	{
		this.config = <DaemonConfig>config.daemon;
	}

}
