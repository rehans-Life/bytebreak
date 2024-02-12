import { Param, Types, getDefaultCodeConfiguration } from 'lang-code-configuration'
import { ProblemConfig } from '../create-problem/interfaces'
import { langs } from 'lang-code-configuration/data'

const generateCodeConfig = function(slug: langs, config: ProblemConfig) : string {
    return getDefaultCodeConfiguration(slug, config.funcName, config.returnType.value as Types, config.params.map(({name, type}) => ({ name, type: type.value })) as Param[])
}

export default generateCodeConfig