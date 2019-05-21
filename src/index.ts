import * as fs from 'fs';
import Daemon from './Daemon';
import Modules from './Modules';
import Notifications from './Notifications';
import WebScraping from './WebScraping';

const CONFIG = 'config.json';

function LoadConfig( file?: string )
{
	return ( file ? fs.promises.readFile( file, 'utf8' ) : Promise.reject( 'No file' ) ).catch( () =>
	{
		return fs.promises.readFile( CONFIG, 'utf8' );
	} ).then( ( data ) =>
	{
		return JSON.parse( data );
	}).then( ( json ) =>
	{
		if ( typeof json !== 'object' ) { throw 'Error: No object.'; }

		const config: ConfigJSON =
		{
			useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3773.0 Safari/537.36',
			scripts: [],
			notifications: {},
		};

		if ( typeof json.daemon === 'object' )
		{
			config.daemon =
			{
				interval: 5,
			};
		}

		if ( typeof json.useragent === 'string' )
		{
			config.useragent = json.useragent;
		}

		if ( Array.isArray( json.scripts ) )
		{
			(<ModuleConfig[]>json.scripts).forEach( ( mconf ) =>
			{
				if ( typeof mconf !== 'object' ) { return; }
				if ( typeof mconf.module !== 'string' || !mconf.module) { return; }

				const conf: ModuleConfig =
				{
					name: '- no name -',
					module: '',
					notification: '',
				};

				conf.disable = !!mconf.disable;

				if ( typeof mconf.name === 'string' ) { conf.name = mconf.name; }

				conf.module = mconf.module;

				conf.args = mconf.args;

				if ( typeof mconf.notification === 'string' || Array.isArray( mconf.notification ) )
				{
					conf.notification = mconf.notification;
				}

				(<ModuleConfig[]>config.scripts).push( conf );
			} );
		}

		if ( typeof json.notifications === 'object' )
		{
			config.notifications = json.notifications;
		}

		if ( typeof json.puppeteer === 'object' )
		{
			config.puppeteer = json.puppeteer;
		}

		return config;
	} ).catch( ( error ) =>
	{
		console.log( error );

		const config: ConfigJSON =
		{
			notifications: {},
		};

		return config;
	});
}

LoadConfig( process.argv[ 2 ] ).then( ( config ) =>
{
	const ws = new WebScraping( config.useragent );
	const mods = new Modules( new Notifications(), ws );

	return mods.init( config ).then( () =>
	{
		if ( !config.daemon )
		{
			return mods.execAll( config.scripts );
		}

		const daemon = new Daemon( config );	
	} ).then( () => { return ws.end(); } );
} ).then( () =>
{
	console.log( 'Complete.' );
} ).catch( ( error ) => { console.log( error ); } );
