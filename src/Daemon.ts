export default class Daemon
{
	private config: DaemonConfig;
	private timer: NodeJS.Timeout | null;

	constructor( config: ConfigJSON )
	{
		this.config = <DaemonConfig>config.daemon;
	}

	public start()
	{
		if ( this.timer ) { this.stop(); }
		this.timer = setInterval( () => { this.update(); }, this.config.interval );
	}

	public stop()
	{
		if ( !this.timer ) { return; }
		clearInterval( this.timer );
		this.timer = null;
	}

	public update()
	{
		
	}

}
