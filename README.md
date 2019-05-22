# Hiyodori

Appleストアの障害とかをいち早く検知するために、自分のローカルでスクレイピングして通知を出すツール。

とりあえず `config.json` に書くといろいろやってくれる。

単純起動で調査もできるし、デーモン化しておくことも可能な感じで作る予定。

## config.json

```js
{
	debug?: boolean;
	daemon?: DaemonConfig|boolean;
	useragent?: string;
	scripts?: ModuleConfig[];
	notifications?: { [ key: string ]: any };
	puppeteer?: Puppeteer.LaunchOptions;
}
```

### debug?: boolean

trueでデバッグモードにする。

### daemon?: DaemonConfig

trueの場合はデフォルト（10分間隔）でデーモンを動かす。

```js
{
	interval: number;
}
```

#### interval: number

動かす間隔を分で指定する。

### useragent?: string

UserAgentを設定する。

### scripts?: ModuleConfig[]

毎回動かすチェックするスクリプトを配列で用意する。

```js
{
	disable?: boolean;
	name: string;
	module: string;
	args?: any;
	notification: string | string[];
}
```

#### disable?: boolean

trueで実行しない。

#### name: string

【必須】スクリプトの名前。識別用。

#### module: string

【必須】動かすモジュールの名前。

モジュールは `/dest/modules/XXX.js` の場合、`XXX` を指定する。

#### args?: any

上記モジュールに追加で渡す引数。何かある場合には指定する。

#### notification: string | string[]

【必須】通知をどの手段で送るかの設定。

`all` もしくは通知の名前を指定する。
複数の通知を指定する場合は配列にする。

また `all` が含まれた時点で全ての通知手段を持って通知を行う。

通知は `/dest/notifications/XXX.js` の場合 `XXX` を指定する。

### notifications?: { [ key: string ]: any }

通知に渡す引数。

キーは通知名で、通知名は `/dest/notifications/XXX.js` の場合 `XXX` を指定する。

例えばPush通知の場合のトークンなどを渡す時などに使う。

### puppeteer?: Puppeteer.LaunchOptions

このシステムが用意した puppeteer を利用する場合の起動オプション。

## 監視用モジュールの作成

TypeScriptの場合 `src/modules/` に用意する。

```ts
import WebScraping from '../WebScraping';

interface CONFIG
{
	disable?: boolean;
	name: string;
	module: string;
	args?: any;
	notification: string | string[];
}

export default function AppleSystemStatus( config: CONFIG, ws: WebScraping ): Promise<NotificationData>
{
	const result =
	{
		send: false,
		title: 'Title',
		message: 'Message',
	};

	return Promise.resolve( result );
}
```

Promiseオブジェクトで結果を返す必要がある。
awaitで漏れをなくすことを推奨。

第一引数は `config.json` の `scripts` 内の設定がそのまま貰える。
`{ "module": "XXX", ... }` の場合、ファイル名は `XXX.js` (TypeScriptのソースの場合は `XXX.ts` ) にする必要がある。

第一引数の `args` は任意のデータを渡すことができるためここにいろいろ詰め込むことを推奨。

第二引数はこのシステムが用意したpuppeteerを使えるオブジェクト。
（よく使いそうな処理はラップして生でも使える。）

結果は以下のフォーマットのオブジェクト。

```js
{
	send: boolean;
	title: string;
	message: string;,
}
```

### send

trueでPush通知を送り、falseで送らない。

ただしデバッグモード時は最初必ず送るので注意。

### title

通知のタイトル。

### message

通知の本文。

## 通知の作成

TypeScriptの場合 `src/notifications/` に用意する。

```js
interface OPTION{}

export default function Windows( data: NotificationData, option?: OPTION ): Promise<ResultData>
{
	console.log('Desktop:',data);

	return Promise.resolve( { message: 'OK' } );
}
```

第一引数はモジュールから渡された通知用データがそのまま帰ってくる。
現状全てのモジュールは以下データを返すことにしている。

```js
{
	send: boolean;
	title: string;
	message: string;,
}
```

第二引数は `config.json` の `notifications` 内の設定がそのまま貰える。

もちろん指定していない場合は `undefined` が渡されるので注意。

`:notifications": { "XXX": {}, ... }` の場合、ファイル名は `XXX.js` (TypeScriptのソースの場合は `XXX.ts` ) にする必要がある。

Push通知で使うトークンなどをここに入れておくのを推奨。

## Sample: config.json

```json
{
	"debug": true,
	"daemon": true,
	"scripts":
	[
		{
			"name": "AppStore(Official)",
			"module": "AppleSystemStatus",
			"args":
			{
				"list": [ "App Store", "Game Center" ]
			},
			"notification": "Web"
		}
	],
	"notifications":
	{
		"AppleSystemStatus": {},
		"Web":
		{
			"credential":
			{
				"type": "service_account",
				"project_id": "XXXXXX",
				"private_key_id": "XXXXXX",
				"private_key": "XXXXXX",
				"client_email": "XXXXXX",
				"client_id": "XXXXXX",
				"auth_uri": "XXXXXX",
				"token_uri": "XXXXXX",
				"auth_provider_x509_cert_url": "XXXXXX",
				"client_x509_cert_url": "XXXXXX"
			  },
			"databaseURL": "https://XXXXXX.firebaseio.com",
			"tokens":
			[
				"XXXXXX"
			]
		}
	},
	"puppeteer": {
		"args":
		[
			"--window-size=1200,950"
		]
	}
}
```

## いろいろ

AndroidのChromeでWebのPush通知を出そうとしたらいろいろ辛かったまとめ。

* Push通知などの許可も出しトークン発行済
  * 通知が出てこないことあり
  * そのままだと持ってる時とかは振動が聞いたりするが、ポケットに入れていると振動しない場合あり
* 上の現状に対して以下のように対応。
  * 設定→アプリと通知→Chrome→通知→Push通知を設定したいサイトのドメインの右の⚙
    * Alertを選択
    * Pop on screenをオン
    * 詳細設定からのバイブレーションのオン、

何かここら辺までやってようやくいい感じに通知を表示してくれた。
