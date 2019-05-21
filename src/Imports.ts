import * as fs from 'fs';
import * as path from 'path';

interface ModFunc<T,K> { ( config: T, option?: any ): Promise<K>; }

export default class Modules<T,K>
{
	protected mods: { [ keys: string ]: ModFunc<T,K> } = {};

	protected load( dir: string )
	{
		const basedir = path.join( __dirname, dir );
		return fs.promises.readdir( basedir ).then( ( files ) =>
		{
			return files.filter( ( file ) =>
			{
				if ( !file.match( '^[^\.].+\.js$' ) ) { return false; }
				const stat = fs.statSync( path.join( basedir, file ) );
				if ( !stat ) { return false; }
				return stat.isFile();
			} );
		} ).then( ( files ) =>
		{
			return Promise.all( files.map( ( file ) =>
			{
				return import( path.join( basedir, file ) ).then( ( mond ) =>
				{
					if ( typeof mond.default !== 'function' )
					{
						console.warn( 'Load failure:', file );
						return;
					}
					const modname = file.replace( /\.js$/, '' );
					console.debug( 'Loaded[' + dir + ']:', modname );
					this.mods[ modname ] = mond.default;
				} );
			} ) );
		} );
	}
}
