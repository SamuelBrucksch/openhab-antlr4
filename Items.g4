grammar Items;

modelitem :
	(basemodelitem | modelgroupitem) WHITESPACE ID
	(WHITESPACE STRING)?
	(WHITESPACE '<' (ID|STRING) '>')?
	(WHITESPACE '(' ID (',' ID)* ')')? 
	(WHITESPACE '[' (ID|STRING) (',' (ID|STRING))* ']')?
	(WHITESPACE '{' modelbinding (',' modelbinding)* '}')?
;

modelgroupitem :
	'Group' (':' basemodelitem ( ':' modelgroupfunction ('(' (ID|STRING) (',' (ID|STRING))* ')')?)?)?
;

itemmodel :
	(modelitem) (NEWLINE | itemmodel)* EOF
;

basemodelitem :
	'Switch' | 'Rollershutter' | 'String' | 'Dimmer' | 'Contact' | 'DateTime' | 'Color' | 'Player' | 'Location' | 'Call' | 'Image' | ('Number' (':' ID)?)
;

modelgroupfunction :
	'EQUAL' | 'AND' | 'OR' | 'NAND' | 'NOR' | 'AVG' | 'SUM' | 'MAX' | 'MIN' | 'COUNT' | 'LATEST' | 'EARLIEST'
;

modelbinding:
	ID '=' STRING   
	('['
        modelproperty? (',' modelproperty)*
    ']')?
;

modelproperty:
    ID '=' valuetype
;

valuetype:
    STRING | NUMBER | BOOLEAN
;

ID  		: '^'?('a'..'z'|'A'..'Z'|'_'|'0'..'9') ('a'..'z'|'A'..'Z'|'_'|'-'|'0'..'9')*;

BOOLEAN: 
    'true' | 'false'
;

NUMBER:
    ID ('.' ID )?
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