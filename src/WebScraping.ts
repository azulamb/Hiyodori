import * as Puppeteer from 'puppeteer';

export default class WebScraping
{
	private browser: Puppeteer.Browser | null;
	// TODO: double start ... Promise[]
	private useragent: string;

	constructor( useragent?: string )
	{
		this.useragent = <string>useragent;
	}

	public start( option?: Puppeteer.LaunchOptions )
	{
		if ( this.browser ) { return Promise.resolve( this.browser ); }
		return Puppeteer.launch( option ).then( ( browser ) =>
		{
			this.browser = browser;
			return browser;
		} );
	}

	public page( useragent?: string )
	{
		return this.start().then( () =>
		{
			return (<Puppeteer.Browser>this.browser).newPage();
		} ).then( ( page ) =>
		{
			if ( typeof useragent !== 'string' ) { useragent = this.useragent; }
			if ( useragent ) { page.setUserAgent( useragent ); }

			return page;
		} );
	}

	public fetch( url: string, option?: Puppeteer.DirectNavigationOptions )
	{
		return this.page().then( ( page ) =>
		{
			return page.goto( url, option ).then( ( response ) =>
			{
				page.close();
				return response;
			} );
		} );
	}

	public waitDomContentLoaded( page: Puppeteer.Page )
	{
		return page.waitForNavigation( { waitUntil: 'domcontentloaded' } );
	}

	public wait( msec: number )
	{
		return new Promise<void>( ( resolve ) =>
		{
			setTimeout( () => { resolve(); }, msec );
		} );
	}

	public end()
	{
		if ( !this.browser ) { return Promise.resolve(); }
		const browser = this.browser;
		this.browser = null;
		return browser.close();
	}
}