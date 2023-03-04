import { LRParser } from '@lezer/lr';
import { LRLanguage, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';
import { completeFromList } from '@codemirror/autocomplete';
import { styleTags, tags } from '@lezer/highlight';

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = LRParser.deserialize({
	version: 14,
	states: "'UOYQPOOObQPO'#C_OjQQO'#CcQOQPOOO]QPOOOrQPO,58yOzQQO'#ClO!PQPO'#CeO!UQQO,58}OOQO'#Cm'#CmOOQO-E6j-E6jOOQO,59W,59WO!^QPO,59POOQO-E6k-E6kO!iQPO1G.kO!nQPO1G.kO!sQPO1G.kO!xQSO'#CgOOQO7+$V7+$VO!}QQO'#CtO#YQQO7+$VO#_QQO7+$VO#dQPO,59RO#iQQO,59`O!iQPO'#CnO#tQPO<<GqO#yQPO<<GqO$OQQO1G.mOOQO-E6l-E6lOOQO,59Y,59YO!iQPOAN=]O$TQPOAN=]O$YQPO7+$XOOQOG22wG22wO$_QSO'#CkO$dQQO'#CxOOQO<<Gs<<GsO$oQPO,59VO$tQQO,59dO$TQPO'#CoO%PQSO1G.qOOQO-E6m-E6mOOQO,59Z,59ZO%UQPO7+$]O%ZQQO<<GwO%`QPOAN=cOOQOG22}G22}",
	stateData: "%e~OfOSPOS~OSPOWQO~OTUOWRX~OUVOdVX~OTUOWRa~OUZO~Og[O~OUVOdVa~OY^O]_O^`O~OiaO~OidO~OieO~O[fO~OjhOUhXdhX~OUiO~OUjO~OjkO~OjhOUhadha~OknO~OkoO~OUpO~OirO~OktO~O[uO~OjwOUlXdlX~OmxO~OjwOUladla~O[{O~Oj|O~OU}O~Ok!OO~O",
	goto: "!ymPPPnPPPqPuPyPPP!Q!W!^!d!jPPPP!pPPP!vRSOTROSTXQWSc^nRmhQsoRzwQTPRYTQWQR]WQgcRlgQvsRyvQb^RqnRqo",
	nodeNames: "⚠ LineComment Program DataSection .DATA StorageType Identifier LogicSection .LOGIC Transition FSACommand State Symbol PDACommand TMCommand TapeState",
	maxTerm: 29,
	skippedNodes: [0, 1],
	repeatNodeCount: 4,
	tokenData: ">X~R|X^#{pq#{qr$pst$ptu$puv$pvw$pxy$uyz$|z{$p{|$p|}%T}!O%Y!O!P&U!P!Q'e!Q![%Y!]!^'j!b!c$p!c!f%Y!f!g(R!g!n%Y!n!o*]!o!r%Y!r!s,P!s!t.u!t!u1k!u!v5O!v!w:R!w!x;W!x!y%Y!y!z;t!z!}%Y#P#Q>S#Q#R$p#R#S%Y#T#o%Y#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{~$QYf~X^#{pq#{#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{S$uO[ST$|OiP[ST%TOkP[S~%YOj~U%aTUQ[S}!O%p!Q![%p!c!}%p#R#S%p#T#o%pQ%uTUQ}!O%p!Q![%p!c!}%p#R#S%p#T#o%p~&XQ!f!g&_!n!o&v~&bP!c!d&e~&hP!v!w&k~&nP!c!d&q~&vOS~~&yP!q!r&|~'PP!i!j'S~'VP!k!l'Y~']P!e!f'`~'eOW~~'jOm~~'oSP~OY'jZ;'S'j;'S;=`'{<%lO'j~(OP;=`<%l'jV(YVUQ[S}!O%p!Q![%p!c!q%p!q!r(o!r!}%p#R#S%p#T#o%pR(tVUQ}!O%p!Q![%p!c!y%p!y!z)Z!z!}%p#R#S%p#T#o%pR)`VUQ}!O%p!Q![%p!c!p%p!p!q)u!q!}%p#R#S%p#T#o%pR)|TUQ^P}!O%p!Q![%p!c!}%p#R#S%p#T#o%pV*dVUQ[S}!O%p!Q![%p!c!g%p!g!h*y!h!}%p#R#S%p#T#o%pR+OVUQ}!O%p!Q![%p!c!h%p!h!i+e!i!}%p#R#S%p#T#o%pR+jVUQ}!O%p!Q![%p!c!v%p!v!w)u!w!}%p#R#S%p#T#o%pV,WVUQ[S}!O%p!Q![%p!c!t%p!t!u,m!u!}%p#R#S%p#T#o%pR,rVUQ}!O%p!Q![%p!c!k%p!k!l-X!l!}%p#R#S%p#T#o%pR-^VUQ}!O%p!Q![%p!c!p%p!p!q-s!q!}%p#R#S%p#T#o%pR-xVUQ}!O%p!Q![%p!c!v%p!v!w._!w!}%p#R#S%p#T#o%pR.fTYPUQ}!O%p!Q![%p!c!}%p#R#S%p#T#o%pV.|VUQ[S}!O%p!Q![%p!c!w%p!w!x/c!x!}%p#R#S%p#T#o%pR/hVUQ}!O%p!Q![%p!c!g%p!g!h/}!h!}%p#R#S%p#T#o%pR0SVUQ}!O%p!Q![%p!c!w%p!w!x0i!x!}%p#R#S%p#T#o%pR0nVUQ}!O%p!Q![%p!c!g%p!g!h1T!h!}%p#R#S%p#T#o%pR1[TUQTP}!O%p!Q![%p!c!}%p#R#S%p#T#o%pV1rXUQ[S}!O%p!Q![%p!c!g%p!g!h2_!h!k%p!k!l3x!l!}%p#R#S%p#T#o%pR2dUUQ}!O%p!Q![%p!c!d2v!d!}%p#R#S%p#T#o%pR2{VUQ}!O%p!Q![%p!c!f%p!f!g3b!g!}%p#R#S%p#T#o%pR3iTUQ]P}!O%p!Q![%p!c!}%p#R#S%p#T#o%pR3}VUQ}!O%p!Q![%p!c!i%p!i!j4d!j!}%p#R#S%p#T#o%pR4iVUQ}!O%p!Q![%p!c!j%p!j!k+e!k!}%p#R#S%p#T#o%pV5VXUQ[S}!O%p!Q![%p!c!e%p!e!f5r!f!v%p!v!w8d!w!}%p#R#S%p#T#o%pR5wUUQ}!O%p!Q![%p!c!d6Z!d!}%p#R#S%p#T#o%pR6`VUQ}!O%p!Q![%p!c!p%p!p!q6u!q!}%p#R#S%p#T#o%pR6|UYPUQpq7`}!O%p!Q![%p!c!}%p#R#S%p#T#o%pP7cQ!n!o7i!t!u8QP7lP!g!h7oP7rP!h!i7uP7xP!v!w7{P8QOYPP8TP!k!l8WP8ZP!i!j8^P8aP!j!k7uR8iUUQ}!O%p!Q![%p!c!d8{!d!}%p#R#S%p#T#o%pR9QVUQ}!O%p!Q![%p!c!e%p!e!f9g!f!}%p#R#S%p#T#o%pR9lVUQ}!O%p!Q![%p!c!m%p!m!n1T!n!}%p#R#S%p#T#o%pV:YUUQ[S}!O%p!Q![%p!c!d:l!d!}%p#R#S%p#T#o%pR:qVUQ}!O%p!Q![%p!c!r%p!r!s0i!s!}%p#R#S%p#T#o%pV;_VUQ[S}!O%p!Q![%p!c!r%p!r!s)u!s!}%p#R#S%p#T#o%pV;{VUQ[S}!O%p!Q![%p!c!t%p!t!u<b!u!}%p#R#S%p#T#o%pR<gVUQ}!O%p!Q![%p!c!k%p!k!l<|!l!}%p#R#S%p#T#o%pR=RVUQ}!O%p!Q![%p!c!v%p!v!w=h!w!}%p#R#S%p#T#o%pR=mVUQ}!O%p!Q![%p!c!g%p!g!h3b!h!}%p#R#S%p#T#o%p~>XOg~",
	tokenizers: [0, 1, 2],
	topRules: { "Program": [0, 2] },
	tokenPrec: 0
});

const AbsMacLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			foldNodeProp.add({
				DataSection: foldInside,
				LogicSection: foldInside,
			}),
			styleTags({
				Symbol: tags.number,
				Identifier: tags.variableName,
				LineComment: tags.lineComment,
				StorageType: tags.bool,
				FSACommand: tags.className,
				PDACommand: tags.className,
				TMCommand: tags.className,
				".DATA": tags.string,
				".LOGIC": tags.string,
			})
		]
	}),
	languageData: {
		commentTokens: { line: ";" }
	}
});
const AbsMacCompletion = AbsMacLanguage.data.of({
	autocomplete: completeFromList([
		{ label: '.DATA', type: 'text' },
		{ label: '.LOGIC', type: 'text' },
		{ label: 'STACK', type: 'type' },
		{ label: 'QUEUE', type: 'type' },
		{ label: 'TAPE', type: 'type' },
		{ label: 'SCAN', type: 'keyword' },
		{ label: 'PRINT', type: 'keyword' },
		{ label: 'SCAN RIGHT', type: 'keyword' },
		{ label: 'SCAN LEFT', type: 'keyword' },
		{ label: 'READ', type: 'keyword' },
		{ label: 'WRITE', type: 'keyword' },
		{ label: 'RIGHT', type: 'keyword' },
		{ label: 'LEFT', type: 'keyword' },
		{ label: 'UP', type: 'keyword' },
		{ label: 'DOWN', type: 'keyword' },
	])
});
function AbsMac() {
	return new LanguageSupport(AbsMacLanguage, [AbsMacCompletion]);
}

export { AbsMac, AbsMacCompletion, AbsMacLanguage };
