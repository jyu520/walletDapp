"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0xproject/json-schemas");
var utils_1 = require("@0xproject/utils");
var _ = require("lodash");
var validUrl = require("valid-url");
var HEX_REGEX = /^0x[0-9A-F]*$/i;
exports.assert = {
    isBigNumber: function (variableName, value) {
        var isBigNumber = _.isObject(value) && value.isBigNumber;
        this.assert(isBigNumber, this.typeAssertionMessage(variableName, 'BigNumber', value));
    },
    isValidBaseUnitAmount: function (variableName, value) {
        exports.assert.isBigNumber(variableName, value);
        var isNegative = value.lessThan(0);
        this.assert(!isNegative, variableName + " cannot be a negative number, found value: " + value.toNumber());
        var hasDecimals = value.decimalPlaces() !== 0;
        this.assert(!hasDecimals, variableName + " should be in baseUnits (no decimals), found value: " + value.toNumber());
    },
    isString: function (variableName, value) {
        this.assert(_.isString(value), this.typeAssertionMessage(variableName, 'string', value));
    },
    isFunction: function (variableName, value) {
        this.assert(_.isFunction(value), this.typeAssertionMessage(variableName, 'function', value));
    },
    isHexString: function (variableName, value) {
        this.assert(_.isString(value) && HEX_REGEX.test(value), this.typeAssertionMessage(variableName, 'HexString', value));
    },
    isETHAddressHex: function (variableName, value) {
        this.assert(_.isString(value), this.typeAssertionMessage(variableName, 'string', value));
        this.assert(utils_1.addressUtils.isAddress(value), this.typeAssertionMessage(variableName, 'ETHAddressHex', value));
    },
    doesBelongToStringEnum: function (variableName, value, stringEnum /* There is no base type for every string enum */) {
        var doesBelongToStringEnum = !_.isUndefined(stringEnum[value]);
        var enumValues = _.keys(stringEnum);
        var enumValuesAsStrings = _.map(enumValues, function (enumValue) { return "'" + enumValue + "'"; });
        var enumValuesAsString = enumValuesAsStrings.join(', ');
        exports.assert.assert(doesBelongToStringEnum, "Expected " + variableName + " to be one of: " + enumValuesAsString + ", encountered: " + value);
    },
    hasAtMostOneUniqueValue: function (value, errMsg) {
        this.assert(_.uniq(value).length <= 1, errMsg);
    },
    isNumber: function (variableName, value) {
        this.assert(_.isFinite(value), this.typeAssertionMessage(variableName, 'number', value));
    },
    isBoolean: function (variableName, value) {
        this.assert(_.isBoolean(value), this.typeAssertionMessage(variableName, 'boolean', value));
    },
    isWeb3Provider: function (variableName, value) {
        var isWeb3Provider = _.isFunction(value.send) || _.isFunction(value.sendAsync);
        this.assert(isWeb3Provider, this.typeAssertionMessage(variableName, 'Provider', value));
    },
    doesConformToSchema: function (variableName, value, schema, subSchemas) {
        var schemaValidator = new json_schemas_1.SchemaValidator();
        if (!_.isUndefined(subSchemas)) {
            _.map(subSchemas, schemaValidator.addSchema.bind(schemaValidator));
        }
        var validationResult = schemaValidator.validate(value, schema);
        var hasValidationErrors = validationResult.errors.length > 0;
        var msg = "Expected " + variableName + " to conform to schema " + schema.id + "\nEncountered: " + JSON.stringify(value, null, '\t') + "\nValidation errors: " + validationResult.errors.join(', ');
        this.assert(!hasValidationErrors, msg);
    },
    isWebUri: function (variableName, value) {
        var isValidUrl = !_.isUndefined(validUrl.isWebUri(value));
        this.assert(isValidUrl, this.typeAssertionMessage(variableName, 'web uri', value));
    },
    isUri: function (variableName, value) {
        var isValidUri = !_.isUndefined(validUrl.isUri(value));
        this.assert(isValidUri, this.typeAssertionMessage(variableName, 'uri', value));
    },
    assert: function (condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    },
    typeAssertionMessage: function (variableName, type, value) {
        return "Expected " + variableName + " to be of type " + type + ", encountered: " + value;
    },
};
//# sourceMappingURL=index.js.map