interface EventCallback { (): void }
export default class Daemon
{
	private config: DaemonConfig;
	private timer: NodeJS.Timeout | null;
	private resolve: ( () => void ) | null;
	private events: { [ keys: string ]: EventCallback[] };

	constructor( config: ConfigJSON )
	{
		this.config = <DaemonConfig>config.daemon;
		this.events = { update: [] };
	}

	public start()
	{
		if ( this.timer ) { this.stop(); }
		const interval = ( 0 < this.config.interval ? this.config.interval : 10 ) * 60000;
		this.timer = setInterval( () => { this.update(); }, interval );
		return new Promise<void>( ( resolve ) => { this.resolve = resolve; } );
	}

	public stop()
	{
		if ( !this.timer ) { return; }
		clearInterval( this.timer );
		this.timer = null;
		if ( this.resolve ) { this.resolve(); }
		this.resolve = null;
	}

	public update()
	{
		this.events.update.forEach( ( callback ) => { callback(); } );
	}

	public addEventListener( event: string, callback: EventCallback )
	{
		if ( !this.events[ event ] ) { this.events[ event ] = []; }

		this.events[ event ].push( callback );
	}

}
