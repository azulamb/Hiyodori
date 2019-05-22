import * as admin from 'firebase-admin';

interface FCMOption
{
	credential: admin.AppOptions;
	databaseURL: string;
	tokens: string[];
}

export default function Web( data: NotificationData, option: FCMOption ): Promise<ResultData>
{
	console.log('Android:',data);

	const app = admin.initializeApp(
	{
		credential: admin.credential.cert( option.credential ),
		databaseURL: option.databaseURL,
	} );
	const tokens = option.tokens || [];

	const message: admin.messaging.MulticastMessage =
	{
		data: { title: 'TITLE', body: 'MESSAGE' },
		tokens: tokens,
	};

	return admin.messaging().sendMulticast( message ).then( ( response ) =>
	{
		console.log(response);
		if ( 0 < response.failureCount )
		{
			console.error( 'Failure tokens:' );
			response.responses.forEach( ( res, index ) =>
			{
				if ( res.success ) { return; }
				console.error( '[' + index + ']: ' + tokens[ index ] );
			} );
		}

		return app.delete();
	} ).then( () =>
	{
		return { message: 'OK' };
	} );
}
