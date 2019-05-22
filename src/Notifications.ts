import Imports from './Imports';

export default class Notifications extends Imports<NotificationData,ResultData>
{
	private status: { [ keys: string ]: boolean };
	private options: { [ key: string ]: any };

	constructor( options?: { [ key: string ]: any } )
	{
		super();
		this.status = {};
		this.options = options || {};
	}

	public init()
	{
		return this.load( 'notifications' );
	}

	private list( types: string[] )
	{
		const list: string[] = [];

		for ( let type of types )
		{
			if ( type === 'all' )
			{
				return Object.keys( this.mods );
			}
			if ( list.includes( type ) || !this.mods[ type ] ) { continue; }
			list.push( type );
		}

		return list;
	}

	public notify( module: string, data: NotificationData, types: string | string[] = 'all' )
	{
		if ( this.status[ module ] === undefined )
		{
			this.status[ module ] = false;
		}
		if ( data.send === this.status[ module ] ) { return Promise.resolve( 'No send: ' + data.message ); }
		this.status[ module ] = data.send;

		types = this.list( typeof types === 'string' ? [ types ] : types );

		return Promise.all( types.map( ( type ) =>
		{
			return this.mods[ type ]( data, this.options[ type ] ).then( ( result ) =>
			{
				return { message: result.message, type: type };
			} );
		} ) ).then( ( result ) =>
		{
			console.log( result );
			return '';
		} );
	}
}
