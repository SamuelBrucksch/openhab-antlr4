grammar Items;

itemmodel :
	(NEWLINE* (modelitem) (NEWLINE | modelitem)*) EOF
;

modelitem :
	(basemodelitem | modelgroupitem) 
	((WHITESPACE | NEWLINE)+ IDENTIFIER)
	((WHITESPACE | NEWLINE)+ STRING)?
	((WHITESPACE | NEWLINE)+ '<' (IDENTIFIER|STRING) '>')?
	((WHITESPACE | NEWLINE)+ '(' IDENTIFIER (',' IDENTIFIER)* ')')? 
	((WHITESPACE | NEWLINE)+ '[' (IDENTIFIER|STRING) (',' (IDENTIFIER|STRING))* ']')?
	((WHITESPACE | NEWLINE)+ '{' modelbinding (',' modelbinding)* '}')?
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

ML_COMMENT	: '/*' .*? '*/' -> channel(HIDDEN);

SL_COMMENT 	: WHITESPACE? '//' .*? (NEWLINE | EOF) -> channel(HIDDEN);

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

NEWLINE
  : CR? LF
  ;

CR: '\r';
LF: '\n';

WHITESPACE: (' '|'\t'|'\f');

ANY_OTHER: .;