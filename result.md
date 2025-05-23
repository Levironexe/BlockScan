**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [solc-version](#solc-version) (1 results) (Informational)
 - [too-many-digits](#too-many-digits) (2 results) (Informational)
 - [constable-states](#constable-states) (3 results) (Optimization)
 - [immutable-states](#immutable-states) (1 results) (Optimization)
## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-0
Version constraint ^0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- VerbatimInvalidDeduplication
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess.
It is used by:
	- [^0.8.20](test_4_with_no_vulns.sol#L2)

test_4_with_no_vulns.sol#L2


## too-many-digits
Impact: Informational
Confidence: Medium
 - [ ] ID-1
[SecureToken.slitherConstructorConstantVariables()](test_4_with_no_vulns.sol#L4-L135) uses literals with too many digits:
	- [MAX_SUPPLY = 1000000 * 10 ** 18](test_4_with_no_vulns.sol#L19)

test_4_with_no_vulns.sol#L4-L135


 - [ ] ID-2
[SecureToken.constructor()](test_4_with_no_vulns.sol#L45-L49) uses literals with too many digits:
	- [_mint(msg.sender,100000 * 10 ** 18)](test_4_with_no_vulns.sol#L48)

test_4_with_no_vulns.sol#L45-L49


## constable-states
Impact: Optimization
Confidence: High
 - [ ] ID-3
[SecureToken.symbol](test_4_with_no_vulns.sol#L13) should be constant 

test_4_with_no_vulns.sol#L13


 - [ ] ID-4
[SecureToken.name](test_4_with_no_vulns.sol#L12) should be constant 

test_4_with_no_vulns.sol#L12


 - [ ] ID-5
[SecureToken.decimals](test_4_with_no_vulns.sol#L14) should be constant 

test_4_with_no_vulns.sol#L14


## immutable-states
Impact: Optimization
Confidence: High
 - [ ] ID-6
[SecureToken.owner](test_4_with_no_vulns.sol#L16) should be immutable 

test_4_with_no_vulns.sol#L16


