pragma solidity ^0.8.1;

interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);


    function mint(address account_, uint256 amount_) external;

    function burn(uint256 amount) external;
    
}

interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastValue;
                // Update the index for the moved value
                set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        return _values(set._inner);
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}

library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrrt(uint256 a) internal pure returns (uint256 c) {
        if (a > 3) {
            c = a;
            uint256 b = add(div(a, 2), 1);
            while (b < c) {
                c = b;
                b = div(add(div(a, b), b), 2);
            }
        } else if (a != 0) {
            c = 1;
        }
    }

    /*
     * Expects percentage to be trailed by 00,
     */
    function percentageAmount(uint256 total_, uint8 percentage_) internal pure returns (uint256 percentAmount_) {
        return div(mul(total_, percentage_), 1000);
    }

    /*
     * Expects percentage to be trailed by 00,
     */
    function substractPercentage(uint256 total_, uint8 percentageToSub_) internal pure returns (uint256 result_) {
        return sub(total_, div(mul(total_, percentageToSub_), 1000));
    }

    function percentageOfTotal(uint256 part_, uint256 total_) internal pure returns (uint256 percent_) {
        return div(mul(part_, 100), total_);
    }

    /**
     * Taken from Hypersonic https://github.com/M2629/HyperSonic/blob/main/Math.sol
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow, so we distribute
        return (a / 2) + (b / 2) + (((a % 2) + (b % 2)) / 2);
    }

    function quadraticPricing(uint256 payment_, uint256 multiplier_) internal pure returns (uint256) {
        return sqrrt(mul(multiplier_, payment_));
    }

    function bondingCurve(uint256 supply_, uint256 multiplier_) internal pure returns (uint256) {
        return mul(multiplier_, supply_);
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract Operator is Ownable {

    address public operator;

    uint256 constant baseRate = 10000;

    

    modifier onlyOperator {

        require(msg.sender == owner() || msg.sender == operator, "no permission");

        _;

    }



    function setOperator(address operator_) external onlyOwner {

        operator = operator_;

    }





    function getCurrTime() external view returns(uint256) {

        return block.timestamp;

    }

    

    function getBlockNum() external view returns(uint256) {

        return block.number;

    }



}

contract HoldEarn is Operator {

    using SafeMath for uint256;

    using SafeERC20 for IERC20;

    using EnumerableSet for EnumerableSet.AddressSet;

    using EnumerableSet for EnumerableSet.UintSet;



    event ChangeToken(uint256 pID, uint256 tID, address oldToken, address newToken, uint256 oldAmount, uint256 newAmount, uint256 tType);

    event AddNewPeriod(uint256 pID);

    event Deposit(address user, address token, uint256 pID, uint256 id, uint256 amount, uint256 time);

    event PeriodUpdate(uint256 pID);

    event SortAccounts(uint256 pID, uint256 tID);

    event WithdrawAll(address user, uint256 pID, uint256 num, uint256 amount);

    event ClaimBaseReward(address user, address token, uint256 pID, uint256 tID, uint256 amount);

    event ClaimSortReward(address user,  address token, uint256 pID,uint256 tID, uint256 amount);

    event ClaimDefaultReward(address user,  address token, uint256 pID, uint256 amount);

    event TransferTo(address token, address account, uint256 amount);

    event AddToken(address token, uint256 amount, uint256 pID, uint256 tID, uint256 tType);

    event RemoveToken(address token, uint256 amount, uint256 pID, uint256 tID);



    uint256 public periodID;

    uint256 constant muti = 1e18;

    address public sortAccount;

    address public proAddress;



    struct RewardTokenInfo {

        address rewardToken;

        uint256 totalAmount;

        uint256 sortNum;

        uint256 perAmount;

    }



    struct PeriodInfo {

        string name;

        address defaultToken;

        address userToken;

        uint256 perDefaultAmount;

        uint256 minAmount;

        uint256 startTime;

        uint256 periodTime;

        uint256 lockTime;

        uint256 minUserNum;

        uint256 maxUserNum;

    }





    struct PeriodState {

        uint256 totalAmount;

        uint256 totalDefaultAmount;

        uint256 endTime;

        bool isSet;

        bool isReach;

        bool isSort;

    }



    struct UserBet {

        uint256 dID;

        uint256 totalAmount;

        uint256 haveClaim;

        uint256 claimDefault;

        uint256[] bTid;

        uint256[] sTid;

        uint256 num;

        bool isClaim;

    }



    struct UserInfo {

        uint256 amount;

        uint256 depositTime;

        bool isClaim;

    }



    struct ClaimInfo {

        uint256[] dIDs;

    }



    struct UserReward {

        uint256 claimBase;

        uint256 claimSort;

    }



    mapping(uint256 => mapping(uint256 => uint256)) public sAmount;

    mapping(address => mapping(uint256 => mapping(uint256 => UserReward))) public userReward;

    mapping(address => mapping(uint256 => mapping(uint256 => ClaimInfo))) claimInfo;

    mapping(uint256 => uint256) public tokenInfoID;

    mapping(uint256 => mapping(uint256 => RewardTokenInfo)) public rewardTokenInfo;

    mapping(uint256 => EnumerableSet.UintSet) rewardID;

    mapping(uint256 => EnumerableSet.UintSet) sortID;



    mapping(uint256 => EnumerableSet.UintSet) removeID;

    mapping(uint256 => mapping(uint256 => uint256)) public returnRewardAmount;

    mapping(uint256 => uint256) public returnDefaultAmount;

    mapping(uint256 => PeriodState) public periodState;

    mapping(uint256 => PeriodInfo) periodInfo;

    mapping(address => mapping(uint256 => UserBet)) userBet;

    mapping(address => mapping(uint256 => mapping(uint256 => UserInfo))) public userInfo;

    mapping(uint256 => EnumerableSet.AddressSet) users;

    mapping(uint256 => mapping(uint256 => EnumerableSet.AddressSet)) sortUsers;

    mapping(address => mapping(uint256 => EnumerableSet.UintSet)) remainDid;

    mapping(address => mapping(uint256 => EnumerableSet.UintSet)) hasClaimDid;

    mapping(uint256 => mapping(uint256 => bool)) public isTidSort;

    mapping(uint256 => uint256) public sortNum;

    mapping(uint256 => mapping(uint256 => uint256)) public haveSortNum;



    constructor(address proAddr) {

        _setProAccount(proAddr);

    }



    modifier isExist(uint256 pID) {

        require(0 < pID && pID <= periodID, "not exist");

        _;

    }



    modifier notStart(uint256 pID) {

        require(block.timestamp < periodInfo[pID].startTime, "has start");

        _;

    }



    function setName(uint256 pID, string memory name) 

        external 

    {

        checkBase(msg.sender, pID);

        periodInfo[pID].name = name;

    }



    function checkBase(address user, uint256 pID) internal view {

        require(

            (user == owner() || user == operator) &&

            0 < pID && pID <= periodID &&

            block.timestamp < periodInfo[pID].startTime,

            "parama"

        );

    }



    function setProAccount(address account) external onlyOwner {

        _setProAccount(account);

    }    



    function _setProAccount(address account) internal {

        require(account != address(0), "addr err");

        proAddress = account;

    }    





    function setSortAccount(address account) external onlyOwner {

        sortAccount = account;

    }





    function setMinNum(uint256 pID, uint256 minNum) external {

        checkSetMinNum(msg.sender, pID, minNum);

        periodInfo[pID].minUserNum = minNum;

    }

    



    function setUserNum(uint256 pID, uint256 min, uint256 max) 

        external

        payable

    {

        checkBase(msg.sender, pID);

        require(min > 0 && min < max, "num err");

        periodInfo[pID].minUserNum = min;

        periodInfo[pID].maxUserNum = max;

    }



    function setUserToken(address token, uint256 pID, uint256 min) 

        external

    {

        checkBase(msg.sender, pID);

        require(min > 0, "min err");

        periodInfo[pID].userToken = token;

        periodInfo[pID].minAmount = min;

    }



    function addToken(uint256 pID, RewardTokenInfo memory rInfo) 

        external 

        payable

    {

        uint256 value = checkAdd(msg.sender, pID, rInfo);

        require(msg.value == value, "value err");



        uint256 tID = ++tokenInfoID[pID];

        rewardTokenInfo[pID][tID] = rInfo;



        uint256 tType;

        if(rInfo.sortNum != 0) {

            tType = 2;

            sortID[pID].add(tID);

        } else {

            tType = 1;

            rewardID[pID].add(tID);

        }



        if(rInfo.rewardToken != address(0)) {

            IERC20(rInfo.rewardToken).safeTransferFrom(msg.sender, address(this), rInfo.totalAmount);

        }

    

        emit AddToken(rInfo.rewardToken, rInfo.totalAmount, pID, tID, tType);

    }



    function removeToken(uint256 pID, uint256 tID) external payable {

        checkRemove(msg.sender, pID, tID);

        

        removeID[pID].add(tID);

        if(sortID[pID].contains(tID)) {

            sortID[pID].remove(tID);

        } else {

            rewardID[pID].remove(tID);

        }



        if(rewardTokenInfo[pID][tID].rewardToken != address(0)) {

            IERC20(rewardTokenInfo[pID][tID].rewardToken).safeTransfer(msg.sender, rewardTokenInfo[pID][tID].totalAmount);

        } else {

            payable(msg.sender).transfer(rewardTokenInfo[pID][tID].totalAmount);

        }



        emit RemoveToken(rewardTokenInfo[pID][tID].rewardToken, rewardTokenInfo[pID][tID].totalAmount, pID, tID);

    }

   

    function setRewardToken(

        uint256 pID,

        uint256 tID,

        address token, 

        uint256 tokenAmount, 

        uint256 sNum

    ) 

        external 

        payable

    {

        checkSetRewardToken(msg.sender, token, pID, tID, tokenAmount, sNum);

        address rToken = rewardTokenInfo[pID][tID].rewardToken;

        uint256 amount = rewardTokenInfo[pID][tID].totalAmount;

     

        if(sNum != 0) {

            rewardID[pID].remove(tID);

            sortID[pID].add(tID);

        } else {

            sortID[pID].remove(tID);

            rewardID[pID].add(tID);

        }



        rewardTokenInfo[pID][tID].sortNum = sNum;



        if(!(rToken == token && amount == tokenAmount)) {

            rewardTokenInfo[pID][tID].rewardToken = token;

            rewardTokenInfo[pID][tID].totalAmount = tokenAmount;



            _transferOut(msg.sender, rToken, amount);



            if(token == address(0)) {

                require(msg.value == tokenAmount, "value err");

            } else {

                IERC20(token).safeTransferFrom(msg.sender, address(this), tokenAmount);

            }



            uint256 tType;

            if(rewardID[pID].contains(tID)) {

                tType = 1;

            }

            if(sortID[pID].contains(tID)) {

                tType = 2;

            }



            emit ChangeToken(pID, tID, rToken, token, amount, tokenAmount, tType);

        } 



    }



    function setPeriodTime(uint256 pID, uint256 time)

        external 

        onlyOperator 

        isExist(pID)

        notStart(pID) 

    {

        require(time > 0, "time err");

    

       periodInfo[pID].periodTime = time;

    }



    function setLockTime(uint256 pID, uint256 time)

        external 

        onlyOperator 

        isExist(pID)

        notStart(pID) 

    {

        require(time > 0, "time err");

    

       periodInfo[pID].lockTime = time;

    }



    function setDefaultToken(uint256 pID, address token, uint256 perAmount) external payable {

        (uint256 beforeAmount, uint256 afterAmount) = checkDefault(msg.sender, token, pID, perAmount);

    

        _transferOut(msg.sender, periodInfo[pID].defaultToken, beforeAmount);

        if(token != address(0)) {

            require(msg.value == 0, "value err");

            _transferIn(msg.sender, token, afterAmount);

        } else {

            require(msg.value == afterAmount, "msgV err");

        }

        

        periodInfo[pID].defaultToken = token;

        periodInfo[pID].perDefaultAmount = perAmount;

        periodState[pID].totalDefaultAmount = afterAmount;

    }





    function addNewPeriod(

        PeriodInfo memory newInfo,

        RewardTokenInfo[] memory rInfo

    ) external payable onlyOperator {

        uint256 value = checkNewPeriod(msg.sender, newInfo, rInfo);

        require(value == msg.value, "value err");

        periodInfo[++periodID] = newInfo;



        for(uint256 i = 0; i < rInfo.length; i++) {

            uint256 tID = ++tokenInfoID[periodID];

            rewardTokenInfo[periodID][tID] = rInfo[i];

            

            if(rInfo[i].sortNum != 0) {

                sortID[periodID].add(tID);

            } else {

                rewardID[periodID].add(tID);

            }

            if(rInfo[i].rewardToken != address(0)) {

                IERC20(rInfo[i].rewardToken).safeTransferFrom(msg.sender, address(this), rInfo[i].totalAmount);

            }

        }



        if(newInfo.perDefaultAmount > 0) {

            uint256 amount = newInfo.perDefaultAmount.mul(newInfo.minUserNum-1);

            periodState[periodID].totalDefaultAmount = amount;

            if(newInfo.defaultToken != address(0)) {

                IERC20(newInfo.defaultToken).safeTransferFrom(msg.sender, address(this), amount);

            }

        }



        emit AddNewPeriod(periodID);

    }



    function transferTo(address token, address account, uint256 amount) public onlyOwner {

        require(account != address(0), "addr err");



        if(token != address(0)) {

            require(IERC20(token).balanceOf(address(this)) >= amount, "not enough");

            IERC20(token).safeTransfer(account, amount);

        } else {

            require(address(this).balance >= amount, "value err");

            payable(account).transfer(amount);

        }

        

        emit TransferTo(address(token), account, amount);

    }



    function deposit(uint256 pID, uint256 amount) external payable {

        checkDeposit(msg.sender, pID, amount);

        if(periodInfo[pID].userToken == address(0)) {

            require(msg.value == amount, "value err");

        } else {

            IERC20(periodInfo[pID].userToken).safeTransferFrom(msg.sender, address(this), amount);

        }

        periodState[pID].totalAmount = periodState[pID].totalAmount.add(amount);

        if(!users[pID].contains(msg.sender)) {

            users[pID].add(msg.sender);

        }

        userBet[msg.sender][pID].totalAmount = userBet[msg.sender][pID].totalAmount.add(amount);

        uint256 id = ++userBet[msg.sender][pID].dID;

        userInfo[msg.sender][pID][id].amount = amount;

        userInfo[msg.sender][pID][id].depositTime = block.timestamp;

        remainDid[msg.sender][pID].add(id);



        update(pID);

        emit Deposit(msg.sender, periodInfo[pID].userToken, pID, id, amount, userInfo[msg.sender][pID][id].depositTime);

    }



    function update(uint256 pID) public {

        if(!periodState[pID].isSet && 0 < pID && pID <= periodID) {

            uint256 time = periodInfo[pID].startTime.add(periodInfo[pID].periodTime);

            if(

                users[pID].length() == periodInfo[pID].maxUserNum || 

                (block.timestamp > time && users[pID].length() >= periodInfo[pID].minUserNum)

            ) {

                if(block.timestamp > time) {

                    periodState[pID].endTime = time;

                } else {

                    periodState[pID].endTime = block.timestamp;

                }

                periodState[pID].isSet = true;

                periodState[pID].isReach = true;

                _periodPrize(pID, true);



                emit PeriodUpdate(pID);

            } else if(

                users[pID].length() < periodInfo[pID].minUserNum && block.timestamp > time

            ) {

                periodState[pID].endTime = time;

                periodState[pID].isSet = true;

                _periodPrize(pID, false);



                emit PeriodUpdate(pID);

            }

        }

    }



    function _periodPrize(uint256 pID, bool isReach) internal {

        if(sortID[pID].length() == 0) {

            periodState[pID].isSort = true;

        }

        if(isReach) {

            returnDefaultAmount[pID] = periodState[pID].totalDefaultAmount;

            _transferOut(proAddress, periodInfo[pID].defaultToken, periodState[pID].totalDefaultAmount);  



            for(uint256 i = 0; i < rewardID[pID].length(); i++) {

                uint256 tID = rewardID[pID].at(i);

                rewardTokenInfo[pID][tID].perAmount = rewardTokenInfo[pID][tID].totalAmount.mul(muti).div(periodState[pID].totalAmount);

            }

        } else {

            periodState[pID].isSort = true;

            for(uint256 i = 0; i < rewardID[pID].length(); i++) {

                uint256 tID = rewardID[pID].at(i);

                returnRewardAmount[pID][tID] = rewardTokenInfo[pID][tID].totalAmount;

                _transferOut(proAddress, rewardTokenInfo[pID][tID].rewardToken, rewardTokenInfo[pID][tID].totalAmount);    

            }



            for(uint256 i = 0; i < sortID[pID].length(); i++) {

                uint256 tID = sortID[pID].at(i);

                returnRewardAmount[pID][tID] = rewardTokenInfo[pID][tID].totalAmount;

                _transferOut(proAddress, rewardTokenInfo[pID][tID].rewardToken, rewardTokenInfo[pID][tID].totalAmount);    

            }



            uint256 len = users[pID].length();

            if(len == 0) {

                returnDefaultAmount[pID] = periodState[pID].totalDefaultAmount;

                _transferOut(proAddress, periodInfo[pID].defaultToken, periodState[pID].totalDefaultAmount);

            } else {

                uint256 amount = periodInfo[pID].perDefaultAmount.mul(len);

                if(amount < periodState[pID].totalDefaultAmount) {

                    uint256 value = periodState[pID].totalDefaultAmount - amount;

                    returnDefaultAmount[pID] = value;

                    _transferOut(proAddress, periodInfo[pID].defaultToken, value);

                }

            }

        }

    }



    function sortAccounts(uint256 pID, uint256 tID, address[] memory accounts) external {

        (uint256 num,) = checkSort(msg.sender, pID, tID, accounts);

        haveSortNum[pID][tID] = haveSortNum[pID][tID].add(num);



        uint256 total = dealArray(pID, tID, accounts);

        sAmount[pID][tID] = sAmount[pID][tID] + total;

        if(

            haveSortNum[pID][tID] == rewardTokenInfo[pID][tID].sortNum ||

            haveSortNum[pID][tID] == users[pID].length()

        ) {

            isTidSort[pID][tID] = true;

            ++sortNum[pID];

            rewardTokenInfo[pID][tID].perAmount = rewardTokenInfo[pID][tID].totalAmount.mul(muti).div(sAmount[pID][tID]);

        }



        if(sortNum[pID] == sortID[pID].length()) {

            periodState[pID].isSort = true;

        }



        emit SortAccounts(pID, tID);

    }



    function claimReward(uint256 pID) external {

        checkClaim(msg.sender, pID);

        _getReward(pID);

    }



    function checkClaim(address user, uint256 pID) public view returns(bool) {

        require(pID > 0 && pID <= periodID && users[pID].contains(user), "parama err");

        require(!userBet[user][pID].isClaim && periodState[pID].isSort, "not claim");



        return true;

    }



    function withdrawAll(uint256 pID) external {

        checkWithdraw(msg.sender, pID);

        uint256 num1 = ++userBet[msg.sender][pID].num;

        uint256 len = remainDid[msg.sender][pID].length();



        uint256 amount;

        uint256 num;

        for(uint256 i = 0; i < len; i++) {

            uint256 dID = remainDid[msg.sender][pID].at(i);

            if(

                block.timestamp > 

                userInfo[msg.sender][pID][dID].depositTime.add(periodInfo[pID].lockTime)

            ) {  

                userInfo[msg.sender][pID][dID].isClaim = true;

                hasClaimDid[msg.sender][pID].add(dID);

                claimInfo[msg.sender][pID][num1].dIDs.push(dID);

                amount = userInfo[msg.sender][pID][dID].amount.add(amount);

                ++num;

            } else {

                break;

            }

        }



        for(uint256 i = 0; i < num; i++) {

            remainDid[msg.sender][pID].remove(remainDid[msg.sender][pID].at(0));

        }

        

        userBet[msg.sender][pID].haveClaim = userBet[msg.sender][pID].haveClaim.add(amount);

        if(amount > 0) {

            _transferOut(msg.sender, periodInfo[pID].userToken, amount);



            emit WithdrawAll(msg.sender, pID, num, amount);

        }

    }





    function checkSetMinNum(address user, uint256 pID, uint256 minNum) public view returns(bool) {

        require(

            (user == owner() || user == operator) && 0 < pID && pID <= periodID,

            "param err"

        );



        require(

            block.timestamp < periodInfo[pID].startTime.add(periodInfo[pID].periodTime) ||

            periodState[pID].endTime != 0,

            "has end"

        );

        require(

            users[pID].length() < periodInfo[pID].minUserNum &&

            minNum > 0 && minNum < periodInfo[pID].maxUserNum,

            "not set"

        );

   

        

        return true;

    }



    function getUserReward(address user, uint256 pID, uint256 tID) 

        external 

        view 

        returns(

            address sToken,

            uint256 sReward,

            address bToken, 

            uint256 bReward,

            address dToken, 

            uint256 dReward

        )  

    {

        sToken = rewardTokenInfo[pID][tID].rewardToken;

        bToken = rewardTokenInfo[pID][tID].rewardToken;

        dToken =  periodInfo[pID].defaultToken;

        if(periodState[pID].isSort) {

            if(periodState[pID].isReach) {

                if(sortUsers[pID][tID].contains(user)) {

                    if(sortID[pID].contains(tID)) {

                        sReward = userBet[user][pID].totalAmount.mul(rewardTokenInfo[pID][tID].perAmount).div(muti);

                    }

                } 

                if(rewardID[pID].contains(tID)) {                    

                    bReward = userBet[user][pID].totalAmount.mul(rewardTokenInfo[pID][tID].perAmount).div(muti);

                }

            } else if(!periodState[pID].isReach && tID == 0 && users[pID].contains(user)){

                dReward = periodInfo[pID].perDefaultAmount;

            } 

        }

    }



    function _getReward(uint256 pID) internal {

        if(periodState[pID].isSort) {

            if(!userBet[msg.sender][pID].isClaim) {

                userBet[msg.sender][pID].isClaim = true;

                if(periodState[pID].isReach) {

                    for(uint256 i = 0; i < sortID[pID].length(); i++) {

                        uint256 tID = sortID[pID].at(i);

                        if(sortUsers[pID][tID].contains(msg.sender)) {

                            uint256 sReward = userBet[msg.sender][pID].totalAmount.mul(rewardTokenInfo[pID][tID].perAmount).div(muti);

                            userReward[msg.sender][pID][tID].claimSort = sReward;

                            userBet[msg.sender][pID].sTid.push(tID);



                            _transferOut(msg.sender, rewardTokenInfo[pID][tID].rewardToken, sReward);

                            emit ClaimSortReward(msg.sender, rewardTokenInfo[pID][tID].rewardToken, pID, tID, sReward);

                        }

                    }



                    

                    for(uint256 j = 0; j < rewardID[pID].length(); j++) {

                        uint256 tID = rewardID[pID].at(j);

                        uint256 bReward = userBet[msg.sender][pID].totalAmount.mul(rewardTokenInfo[pID][tID].perAmount).div(muti);

                        userReward[msg.sender][pID][tID].claimBase = bReward;

                        userBet[msg.sender][pID].bTid.push(tID);



                        _transferOut(msg.sender, rewardTokenInfo[pID][tID].rewardToken, bReward);



                        emit ClaimBaseReward(msg.sender, rewardTokenInfo[pID][tID].rewardToken, pID, tID, bReward);

                    }



                } else {

                    userBet[msg.sender][pID].claimDefault = periodInfo[pID].perDefaultAmount;

                    _transferOut(msg.sender, periodInfo[pID].defaultToken, periodInfo[pID].perDefaultAmount);

                    emit ClaimDefaultReward(msg.sender, periodInfo[pID].defaultToken, pID, periodInfo[pID].perDefaultAmount);

                }



            }

        

        }

        

    }





    function checkSort(

        address user, 

        uint256 pID, 

        uint256 tID,

        address[] memory accounts

    ) public view returns(uint256 num1, uint256 num2) {

        require(

            accounts.length > 0 &&

            sortAccount == user &&

            periodState[pID].isSet && 

            periodState[pID].isReach &&

            !periodState[pID].isSort, 

            "sort err"

        );

  

        require(!isTidSort[pID][tID] && sortID[pID].contains(tID), "tID err");

        

        uint256 len = accounts.length.add(haveSortNum[pID][tID]);



        if(users[pID].length() >= rewardTokenInfo[pID][tID].sortNum) {

            require(len <= rewardTokenInfo[pID][tID].sortNum, "len err");

            num2 = rewardTokenInfo[pID][tID].sortNum - len;

        } else {

            require(len <= users[pID].length(), "len err");

            num2 = users[pID].length() - len;

        }

        num1 = accounts.length;

    }



    function dealArray(uint256 pID, uint256 tID, address[] memory accounts) 

        internal  

        returns(uint256 total) 

    {

        uint256 len = accounts.length;

        for(uint256 i = 0; i < len; i++) {

            address user = accounts[i];

            uint256 amount1 = userBet[user][pID].totalAmount;

            if(amount1 == 0) {

                revert("user err");

            }



            if(i != len - 1) {

                uint256 amount2 = userBet[accounts[i+1]][pID].totalAmount;

                if(amount1 < amount2) {

                    revert("sort err");

                }

            }

            if(!sortUsers[pID][tID].contains(user)) {

                sortUsers[pID][tID].add(user);

            } else {

                revert("repeat");

            }

            sortUsers[pID][tID].add(user);

            total = total.add(amount1);

        }

    }

    



    function checkDeposit(address user, uint256 pID, uint256 amount) public view returns(bool) {

        require(pID > 0 && pID <= periodID && user != address(0), "param err");



        require(

            block.timestamp >= periodInfo[pID].startTime && 

            block.timestamp < periodInfo[pID].startTime.add(periodInfo[pID].periodTime) && 

            periodState[pID].endTime == 0, "time err"

        );

        require(amount >= periodInfo[pID].minAmount, "amount err");

        



        return true;

    }



    function checkNewPeriod(

        address user,

        PeriodInfo memory newInfo,

        RewardTokenInfo[] memory rInfo

    ) public view returns(uint256 value) {

        require(user == owner() || user == operator, "no auth");

        require(newInfo.minUserNum > 0 && newInfo.maxUserNum > newInfo.minUserNum, "num err");



        if(newInfo.minUserNum > 1) {

            require(newInfo.perDefaultAmount > 0, "perD err");

        }else {

            require(newInfo.perDefaultAmount == 0, "should zero");

        }



        require(newInfo.minAmount > 0, "minA err");

        require(newInfo.startTime > block.timestamp && newInfo.periodTime > 0 && newInfo.lockTime > 0, "time err");

    

        uint256 len = rInfo.length;

        require(len > 0, "rInfo err");



        for(uint256 i = 0; i < len; i++) {

            require(rInfo[i].sortNum <= newInfo.maxUserNum, "sNum err");

            if(rInfo[i].sortNum == 0) {

                require(rInfo[i].totalAmount.div(newInfo.maxUserNum) > 0, "tAmount err");

            } else {

                require(rInfo[i].totalAmount.div(rInfo[i].sortNum) > 0, "sAmount err");                

            }

            require(rInfo[i].perAmount == 0, "pAmount err");

            if(rInfo[i].rewardToken == address(0)) {

                value = rInfo[i].totalAmount.add(value);

            }

        }



        if(newInfo.defaultToken == address(0)) {

            value = value.add(newInfo.perDefaultAmount.mul(newInfo.minUserNum-1));

        }

    }



    function getUsersNum(uint256 pID) external view returns(uint256) {

        return users[pID].length();

    }



    function getUser(uint256 pID, uint256 index) external view returns(address, uint256) {

        address user = users[pID].at(index);

        return (user, userBet[user][pID].totalAmount);

    }



   function getSortUsersNum(uint256 pID, uint256 tID) external view returns(uint256) {

        return sortUsers[pID][tID].length();

    }



    function getSortUser(uint256 pID, uint256 tID, uint256 index) external view returns(address) {

        return sortUsers[pID][tID].at(index);

    }



    function getUserIDNum(address user, uint256 pID, uint256 tType)  external view returns(uint256) {

        if(tType == 1) {

            return remainDid[user][pID].length();

        }

        if(tType == 2) {

            return hasClaimDid[user][pID].length();

        }



        return 0;

    }



    function getUserID(address user, uint256 pID, uint256 tType, uint256 index) external view returns(uint256) {

        if(tType == 1) {

            return remainDid[user][pID].at(index);

        }

        if(tType == 2) {

            return hasClaimDid[user][pID].at(index);

        }



        return 0;

    }



    function getPoolInfo(uint256 pID) external view returns(PeriodInfo memory) {

        return periodInfo[pID];

    }



    function getStatus(uint256 pID) external view returns(uint256) {

        if(pID < 1 || pID > periodID) {

            return 5;

        }else if(block.timestamp < periodInfo[pID].startTime) {

            return 1;

        } else if (

            periodInfo[pID].startTime <= block.timestamp && 

            periodState[pID].endTime == 0 &&

            block.timestamp < periodInfo[pID].startTime.add(periodInfo[pID].periodTime)

        ) {

            return 2;

        } else if (

            (periodState[pID].endTime != 0 && 

            periodState[pID].endTime <= block.timestamp ||

            block.timestamp >= periodInfo[pID].startTime.add(periodInfo[pID].periodTime)) &&

            !periodState[pID].isSort

            

        ){

            return 3;

        } else if(

            periodState[pID].endTime != 0 && 

            periodState[pID].endTime <= block.timestamp &&

            periodState[pID].isSort



        ) {

            return 4;

        }

        return 0;

    }



    function getUserBet(address user, uint256 pID) external view returns(UserBet memory) {

        return userBet[user][pID];

    }



    function checkRemove(

        address account, 

        uint256 pID, 

        uint256 tID

    ) public view returns(bool) {

        check(account, pID);

        require(rewardID[pID].contains(tID) || sortID[pID].contains(tID), "tID err");

        require(rewardID[pID].length() + sortID[pID].length() > 1, "not all");



        return true;

    }



    function check(address account, uint256 pID) internal view {

        require((account == owner() || account == operator) && 0 < pID && pID <= periodID, "param err");

        

        require(block.timestamp < periodInfo[pID].startTime, "has start");

    }



    function checkAdd(

        address account,

        uint256 pID,

        RewardTokenInfo memory rInfo

    ) public view returns(uint256 value) {

        check(account, pID);



        require(rInfo.sortNum <= periodInfo[pID].maxUserNum, "sortNum err");

        if(rInfo.sortNum == 0) {

            require(rInfo.totalAmount.div(periodInfo[pID].maxUserNum) > 0, "tAmount err");

        } else {

            require(rInfo.totalAmount.div(rInfo.sortNum) > 0, "sAmount err");                

        }

        require(rInfo.perAmount == 0, "pAmount err");

        if(rInfo.rewardToken == address(0)) {

            value = rInfo.totalAmount;

        }

    } 



    function checkSetRewardToken(

        address account,

        address token, 

        uint256 pID, 

        uint256 tID,

        uint256 tokenAmount,

        uint256 sNum

    ) public view returns(bool) {

        check(account, pID);

        require(rewardID[pID].contains(tID) || sortID[pID].contains(tID), "tID err");



        if(rewardTokenInfo[pID][pID].rewardToken == token && rewardTokenInfo[pID][tID].totalAmount == tokenAmount && sNum == rewardTokenInfo[pID][tID].sortNum) {

            revert("set same");

        }

        

        require(sNum <= periodInfo[pID].maxUserNum, "sortNum err");

        if(sNum == 0) {

            require(tokenAmount.div(periodInfo[pID].maxUserNum) > 0, "tAmount err");

        } else {

            require(tokenAmount.div(sNum) > 0, "sAmount err");                

        }



        return true;

    }





    function getTidNum(uint256 pID, uint256 tType) external view returns(uint256) {

        if(tType == 1) {

            return rewardID[pID].length();

        }

        

        if(tType == 2) {

            return sortID[pID].length();

        }



        if(tType == 3) {

            return removeID[pID].length();

        }

        return 0;

    }



    function getTid(uint256 pID, uint256 tType, uint256 index) external view returns(uint256) {

        if(tType == 1) {

            return rewardID[pID].at(index);

        }

        

        if(tType == 2) {

            return sortID[pID].at(index);

        }



        if(tType == 3) {

            return removeID[pID].at(index);

        }

        return 0;

    } 



    function getClaimInfo(address user, uint256 pID, uint256 num) external view returns(ClaimInfo memory) {

        return claimInfo[user][pID][num];

    }

    

    function checkDefault(address user, address token, uint256 pID, uint256 amount) 

        public

        view

        returns(uint256 beforeAmount, uint256 afterAmount)

    {

        check(user, pID);

        require(

            !(periodInfo[pID].defaultToken == token && periodInfo[pID].perDefaultAmount == amount), 

            "not set"

        );



        if(periodInfo[pID].minUserNum > 1) {

            require(amount > 0, "amount err");

            beforeAmount = periodState[periodID].totalDefaultAmount;

            afterAmount = amount.mul(periodInfo[pID].minUserNum-1);

        } else {

            require(amount == 0, "should zero");



        }

    }



    function _transferOut(address user, address token, uint256 amount) internal {

        if(amount > 0) {

            if(token != address(0)) {

                IERC20(token).safeTransfer(user, amount);

            } else {

                payable(user).transfer(amount);

            }

        }

    }



    function _transferIn(address user, address token, uint256 amount) internal {

        if(amount > 0) {

            IERC20(token).safeTransferFrom(user, address(this), amount);

        }

    }



    function checkWithdraw(address user, uint256 pID) 

        public 

        view 

        returns(bool) 

    {

        require(

            pID > 0 && 

            pID <= periodID && 

            users[pID].contains(user) && 

            remainDid[user][pID].length() > 0,

            "withdraw err"

        );

       



        require(

            block.timestamp > userInfo[user][pID][remainDid[user][pID].at(0)].depositTime.add(periodInfo[pID].lockTime) &&

            !userInfo[user][pID][remainDid[user][pID].at(0)].isClaim,

            "no unLock"

        );            



        return true;

    }

}
