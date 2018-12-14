grammar Items;

itemmodel :
	(NEWLINE* (modelitem) (NEWLINE | modelitem)*) EOF
;

modelitem :
	(basemodelitem | modelgroupitem) WHITESPACE+ IDENTIFIER
	(WHITESPACE+ STRING)?
	(WHITESPACE+ '<' (IDENTIFIER|STRING) '>')?
	(WHITESPACE+ '(' IDENTIFIER (',' IDENTIFIER)* ')')? 
	(WHITESPACE+ '[' (IDENTIFIER|STRING) (',' (IDENTIFIER|STRING))* ']')?
	(WHITESPACE+ '{' modelbinding (',' modelbinding)* '}')?
;

modelgroupitem :
	'Group' (':' basemodelitem ( ':' modelgroupfunction ('(' (IDENTIFIER|STRING) (',' (IDENTIFIER|STRING))* ')')?)?)?
;

basemodelitem 
	: 'Switch' 
	| 'Rollershutter' 
	| 'String' 
	| 'Dimmer' 
	| 'Contact' 
	| 'DateTime' 
	| 'Color' 
	| 'Player' 
	| 'Location' 
	| 'Call' 
	| 'Image' 
	| ('Number' (':' IDENTIFIER)?)
;

modelgroupfunction 
	: 'EQUAL' 
	| 'AND' '(' (valuetype | IDENTIFIER) ',' (valuetype | IDENTIFIER)  ')' 
	| 'OR' '(' (valuetype | IDENTIFIER) ',' (valuetype | IDENTIFIER)  ')'
	| 'NAND' '(' (valuetype | IDENTIFIER) ',' (valuetype | IDENTIFIER)  ')'
	| 'NOR' '(' (valuetype | IDENTIFIER) ',' (valuetype | IDENTIFIER)  ')'
	| 'AVG' 
	| 'SUM' 
	| 'MAX' 
	| 'MIN' 
	| 'COUNT' 
	| 'LATEST' 
	| 'EARLIEST'
;

modelbinding:
	IDENTIFIER '=' STRING   
	('['
        modelproperty? (',' modelproperty)*
    ']')?
;

modelproperty:
    IDENTIFIER '=' valuetype
;

valuetype:
    STRING | NUMBER | BOOLEAN
;


IDENTIFIER: '^'?('a'..'z'|'A'..'Z'|'_'|'0'..'9') ('a'..'z'|'A'..'Z'|'_'|'-'|'0'..'9')*;

BOOLEAN: 
    'true' | 'false'
;

NUMBER:
    IDENTIFIER ('.' IDENTIFIER )?
;

STRING	: 
			'"' ( '\\' ('b'|'t'|'n'|'f'|'r'|'u'|'"'|'\''|'\\') | ~('\\'|'"') )* '"' |
			'\'' ( '\\' ('b'|'t'|'n'|'f'|'r'|'u'|'"'|'\''|'\\') | ~('\\'|'\'') )* '\''
		; 
ML_COMMENT	: '/*' .*? '*/' -> channel(HIDDEN);

SL_COMMENT 	: '//' ~('\n'|'\r')* ('\r'? '\n')? -> channel(HIDDEN);

NEWLINE : ('\r'|'\n');

WHITESPACE: (' '|'\t');

ANY_OTHER: .;