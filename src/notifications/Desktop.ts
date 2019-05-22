import * as notifier from 'node-notifier';

export default function Windows( data: NotificationData ): Promise<ResultData>
{
	console.log('Desktop:',data);

	return new Promise( ( resolve, reject ) =>
	{
		notifier.notify(
		{
			title: data.title,
			message: data.message,
		}, ( error, response, data ) =>
		{
			if ( error ) { return reject( error ); }
			resolve( data );
		} );
	} ).then( ( data ) =>
	{
		return { message: 'OK' };
	} );
}
