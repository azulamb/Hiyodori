import Imports from './Imports';
import Notifications from './Notifications';
import WebScraping from './WebScraping';

export default class Modules extends Imports<ModuleConfig,NotificationData>
{
	private notifications: Notifications;
	private ws: WebScraping;
	private debug: boolean;

	constructor( notifications: Notifications, ws: WebScraping )
	{
		super();

		this.notifications = notifications;
		this.ws = ws;
	}

	public async init( config: ConfigJSON )
	{
		this.debug = !!config.debug;
		await this.notifications.init();
		await this.ws.start( config.puppeteer ); // TODO: remove.
		return this.load( 'modules' );
	}

	public execAll( configs: ModuleConfig[] = [] )
	{
		return Promise.all( configs.map( ( config ) =>
		{
			return this.exec( config );
		} ) ).then( () =>
		{

		} );
	}

	public exec( config: ModuleConfig )
	{
console.log('exec:',config,this.mods);
		if ( !this.mods[ config.module ] ) { return Promise.reject( 'Notfound: ' + config.name ); }
		if ( config.disable ) { return Promise.reject( 'Disable: ' + config.name ); }

		return this.mods[ config.module ]( config, this.ws ).then( ( result ) =>
		{
			console.log( result );
			// TODO: notification check.

			if ( this.debug )
			{
				result.send = true;
			}
			return this.notifications.notify( config.module, result, config.notification );
		} ).catch( ( error ) =>
		{
			console.error( error );
			return 'Error:';
		} );
	}
}
