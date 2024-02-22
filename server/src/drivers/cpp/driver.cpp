#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <map>
#include <stdexcept>
#include <stack>
#include <memory>
#include <regex>
#include <tuple>
#include <type_traits>
#include <utility>
#include <ostream>

using namespace std;

void printOutput(vector<int> arr)
{
    cout << "[";

    for (size_t i = 0; i < arr.size(); ++i)
    {
        if (i != 0)
        {
            cout << ",";
        }
        cout << arr.at(i);
    }
    cout << "]";
}

void printOutput(vector<string> arr)
{
    cout << "[";

    for (size_t i = 0; i < arr.size(); ++i)
    {
        if (i != 0)
        {
            cout << ",";
        }
        cout << arr.at(i);
    }
    cout << "]";
}

void printOutput(vector<vector<string>> arr)
{
    cout << "[";

    for (size_t i = 0; i < arr.size(); ++i)
    {
        if (i != 0)
        {
            cout << ",";
        }
        printOutput(arr[i]);
    }
    cout << "]";
}

void printOutput(vector<vector<int>> arr)
{
    cout << "[";

    for (size_t i = 0; i < arr.size(); ++i)
    {
        if (i != 0)
        {
            cout << ",";
        }
        printOutput(arr[i]);
    }
    cout << "]";
}

void printOutput(string output)
{
    cout << output;
}

void printOutput(int output)
{
    cout << output;
}

void printOutput(bool output)
{
    cout << output;
}

namespace JSON
{
    class JSONNode;
    using JSONObject = std::map<std::string, std::shared_ptr<JSONNode>>;
    using JSONList = std::vector<std::shared_ptr<JSONNode>>;

    class JSONNode
    {
        enum class Type
        {
            OBJECT,
            LIST,
            STRING,
            NUMBER,
            BOOLEAN,
            NULL_TYPE
        }; // make it private
        union Values
        {
            JSONObject *object;
            JSONList *list;
            std::string *s;
            float fValue;
            bool bValue;
        } values;
        Type type;

    public:
        JSONNode() {}
        JSONNode(Type t) { type = t; }
        auto returnObject()
        {
            if (type == Type::OBJECT)
            {
                return *values.object;
            }
            throw std::logic_error("Improper return");
        }
        auto returnList()
        {
            if (type == Type::LIST)
            {
                return *values.list;
            }
            throw std::logic_error("Improper return");
        }
        auto returnString()
        {
            if (type == Type::STRING)
            {
                return *values.s;
            }
            throw std::logic_error("Improper return");
        }
        auto returnFloat()
        {
            if (type == Type::NUMBER)
            {
                return values.fValue;
            }
            throw std::logic_error("Improper return");
        }

        void setObject(JSONObject *object)
        {
            this->values.object = object;
            type = Type::OBJECT;
        }

        void setString(std::string *s)
        {
            this->values.s = s;
            type = Type::STRING;
        }
        void setNumber(float f)
        {
            this->values.fValue = f;
            type = Type::NUMBER;
        }
        void setList(JSONList *list)
        {
            this->values.list = list;
            type = Type::LIST;
        }

        void setBoolean(bool v)
        {
            this->values.bValue = v;
            type = Type::BOOLEAN;
        }

        void setNull()
        {
            type = Type::NULL_TYPE;
        }

        std::string toString(int indentationLevel)
        {
            std::string spaceString = std::string(indentationLevel, ' ');
            std::string outputString = "";
            switch (type)
            {
            case Type::STRING:
            {
                outputString += spaceString + *values.s;
                break;
            }
            case Type::NUMBER:
            {
                outputString += spaceString + std::to_string(values.fValue);
                break;
            }
            case Type::BOOLEAN:
            {
                outputString += spaceString + (values.bValue ? "true" : "false");
                break;
            }
            case Type::NULL_TYPE:
            {
                outputString += spaceString + "null";
                break;
            }
            case Type::LIST:
            {
                int index = 0;
                for (auto node : (*values.list))
                {
                    outputString += node->toString(indentationLevel + 1);
                    if (index < (*values.list).size() - 1)
                    {
                        outputString += spaceString + ", ";
                    }
                    index++;
                }
                outputString += spaceString + "]\n";
                break;
            }
            case Type::OBJECT:
            {
                outputString += "{\n";
                for (JSONObject::iterator i = (*values.object).begin();
                     i != (*values.object).end(); i++)
                {
                    outputString += spaceString + i->first + ": ";
                    outputString += i->second->toString(indentationLevel + 1);
                    JSONObject::iterator next = i;
                    next++;
                    if ((next) != (*values.object).end())
                    {
                        outputString += spaceString + ",";
                    }
                    outputString += spaceString + "\n";
                }
                outputString += "}\n";
                return outputString;
            }
            };
        }

        void printNode(int indentationLevel)
        {
            std::cout << toString(indentationLevel);
        }
    };
}

enum class TOKEN
{
    CURLY_OPEN,
    CURLY_CLOSE,
    COLON,
    STRING,
    NUMBER,
    ARRAY_OPEN,
    ARRAY_CLOSE,
    COMMA,
    BOOLEAN,
    NULL_TYPE
};

struct Token
{
    std::string value;
    TOKEN type;
    std::string toString()
    {
        switch (type)
        {
        case TOKEN::CURLY_OPEN:
        {
            return "Curly open";
        }
        case TOKEN::CURLY_CLOSE:
        {
            return "Curly close";
        }
        case TOKEN::COLON:
        {
            return "COLON";
        }
        case TOKEN::NUMBER:
        {
            return "Number: " + value;
        }
        case TOKEN::STRING:
        {
            return "String: " + value;
        }

        case TOKEN::ARRAY_OPEN:
        {
            return "Array open";
        }
        case TOKEN::ARRAY_CLOSE:
        {
            return "Array close";
        }
        case TOKEN::COMMA:
        {
            return "Comma";
        }
        case TOKEN::BOOLEAN:
        {
            return "Boolean: " + value;
            ;
        }

        case TOKEN::NULL_TYPE:
        {
            return "Null";
        }
        }
    }
};

class Tokenizer
{
    std::stringstream file;
    size_t prevPos;

public:
    Tokenizer(std::string fileName)
    {
        file << fileName;
    }
    auto getWithoutWhiteSpace()
    {
        char c = ' ';
        while ((c == ' ' || c == '\n'))
        {
            file.get(c); // check

            if ((c == ' ' || c == '\n') && !file.good())
            {
                throw std::logic_error("Ran out of tokens");
            }
            else if (!file.good())
            {
                return c;
            }
        }
        return c;
    }
    auto getToken()
    {
        // string buf;
        char c;
        prevPos = file.tellg();
        c = getWithoutWhiteSpace();

        struct Token token;
        if (c == '"')
        {
            token.type = TOKEN::STRING;
            token.value = "";
            file.get(c);
            while (c != '"')
            {
                token.value += c;
                file.get(c);
            }
        }
        else if (c == '\{')
        {
            token.type = TOKEN::CURLY_OPEN;
        }
        else if (c == '}')
        {
            token.type = TOKEN::CURLY_CLOSE;
        }
        else if (c == '-' || (c >= '0' && c <= '9'))
        {
            // Check if string is numeric
            token.type = TOKEN::NUMBER;
            token.value = "";
            token.value += c;
            std::streampos prevCharPos = file.tellg();
            while ((c == '-') || (c >= '0' && c <= '9') || c == '.')
            {
                prevCharPos = file.tellg();
                file.get(c);

                if (file.eof())
                {
                    break;
                }
                else
                {
                    if ((c == '-') || (c >= '0' && c <= '9') || (c == '.'))
                    {
                        token.value += c;
                    }
                    else
                    {
                        file.seekg(prevCharPos);
                    }
                }
            }
        }
        else if (c == 'f')
        {
            token.type = TOKEN::BOOLEAN;
            token.value = "False";
            file.seekg(4, std::ios_base::cur);
        }
        else if (c == 't')
        {
            token.type = TOKEN::BOOLEAN;
            token.value = "True";
            file.seekg(3, std::ios_base::cur);
        }
        else if (c == 'n')
        {
            token.type = TOKEN::NULL_TYPE;
            file.seekg(3, std::ios_base::cur);
        }
        else if (c == '[')
        {
            token.type = TOKEN::ARRAY_OPEN;
        }
        else if (c == ']')
        {
            token.type = TOKEN::ARRAY_CLOSE;
        }
        else if (c == ':')
        {
            token.type = TOKEN::COLON;
        }
        else if (c == ',')
        {
            token.type = TOKEN::COMMA;
        }
        return token;
    }

    auto hasMoreTokens()
    {
        return !file.eof();
    }

    void rollBackToken()
    {
        if (file.eof())
        {
            file.clear();
        }
        file.seekg(prevPos);
    }
};

class JSONParser
{
    std::stringstream file;

public:
    std::shared_ptr<JSON::JSONNode> root;
    std::unique_ptr<JSON::JSONNode> current;
    Tokenizer tokenizer;
    JSONParser(const std::string filename) : tokenizer(filename) {}

    void parse()
    {
        std::string key = "";
        while (tokenizer.hasMoreTokens())
        {
            Token token;
            try
            {
                token = tokenizer.getToken();
                switch (token.type)
                {
                case TOKEN::CURLY_OPEN:
                {
                    std::shared_ptr<JSON::JSONNode> parsedObject = parseObject();
                    parsedObject->printNode(0);
                    if (!root)
                    {
                        root = parsedObject;
                    }
                    break;
                }
                case TOKEN::ARRAY_OPEN:
                {
                    std::shared_ptr<JSON::JSONNode> parsedList = parseList();
                    // parsedList->printNode(0);
                    if (!root)
                    {
                        root = parsedList;
                    }
                    break;
                }

                case TOKEN::STRING:
                {
                    tokenizer.rollBackToken();
                    std::shared_ptr<JSON::JSONNode> parsedString = parseString();
                    // parsedString->printNode(0);
                    if (!root)
                    {
                        root = parsedString;
                    }
                    break;
                }
                case TOKEN::NUMBER:
                {
                    tokenizer.rollBackToken();
                    std::shared_ptr<JSON::JSONNode> parsedNumber = parseNumber();
                    // parsedNumber->printNode(0);
                    if (!root)
                    {
                        root = parsedNumber;
                    }
                    break;
                }

                case TOKEN::BOOLEAN:
                {
                    tokenizer.rollBackToken();
                    std::shared_ptr<JSON::JSONNode> parsedBoolean = parseBoolean();
                    // parsedBoolean->printNode(0);
                    break;
                }
                }
            }

            catch (std::logic_error e)
            {
                break;
            }
        }
        // assert token not valid
    }

    std::shared_ptr<JSON::JSONNode> parseObject()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        JSON::JSONObject *keyObjectMap = new JSON::JSONObject();
        bool hasCompleted = false;
        while (!hasCompleted)
        {
            if (tokenizer.hasMoreTokens())
            {
                Token nextToken = tokenizer.getToken();
                std::string key = nextToken.value;
                tokenizer.getToken();
                nextToken = tokenizer.getToken();
                std::shared_ptr<JSON::JSONNode> node;
                switch (nextToken.type)
                {
                case TOKEN::STRING:
                {
                    tokenizer.rollBackToken();
                    (*keyObjectMap)[key] = parseString();
                    break;
                }
                case TOKEN::ARRAY_OPEN:
                {
                    (*keyObjectMap)[key] = parseList();
                    break;
                }
                case TOKEN::NUMBER:
                {
                    tokenizer.rollBackToken();
                    (*keyObjectMap)[key] = parseNumber();
                    break;
                }
                case TOKEN::CURLY_OPEN:
                {
                    (*keyObjectMap)[key] = parseObject();
                    break;
                }
                case TOKEN::BOOLEAN:
                {
                    tokenizer.rollBackToken();
                    (*keyObjectMap)[key] = parseBoolean();
                    // parsedBoolean->printNode(0);
                    break;
                }
                case TOKEN::NULL_TYPE:
                {
                    (*keyObjectMap)[key] = parseNull();
                    break;
                }
                }
                nextToken = tokenizer.getToken();
                if (nextToken.type == TOKEN::CURLY_CLOSE)
                {
                    hasCompleted = true;
                    break;
                }
            }
            else
            {
                throw std::logic_error("No more tokens");
            }
        }
        node->setObject(keyObjectMap);
        return node;
    }
    std::shared_ptr<JSON::JSONNode> parseString()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        Token token = tokenizer.getToken();
        std::string *sValue = new std::string(token.value);
        node->setString(sValue);
        return node;
    }
    std::shared_ptr<JSON::JSONNode> parseNumber()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        Token nextToken = tokenizer.getToken();
        std::string value = nextToken.value;
        float fValue = std::stof(value);
        node->setNumber(fValue);
        return node;
    }

    std::shared_ptr<JSON::JSONNode> parseList()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        JSON::JSONList *list =
            new JSON::JSONList();
        bool hasCompleted = false;
        while (!hasCompleted)
        {
            if (!tokenizer.hasMoreTokens())
            {
                throw std::logic_error("No more tokens");
            }
            else
            {
                Token nextToken = tokenizer.getToken();
                std::shared_ptr<JSON::JSONNode> node;
                switch (nextToken.type)
                {
                case TOKEN::ARRAY_OPEN:
                {
                    node = parseList();
                    break;
                }
                case TOKEN::CURLY_OPEN:
                {
                    node = parseObject();
                    break;
                }
                case TOKEN::STRING:
                {
                    tokenizer.rollBackToken();
                    node = parseString();
                    break;
                }
                case TOKEN::NUMBER:
                {
                    tokenizer.rollBackToken();
                    node = parseNumber();
                    break;
                }
                case TOKEN::BOOLEAN:
                {
                    tokenizer.rollBackToken();
                    node = parseBoolean();
                    break;
                }
                case TOKEN::NULL_TYPE:
                {
                    node = parseNull();
                    break;
                }
                }
                list->push_back(node);
                nextToken = tokenizer.getToken();
                if (nextToken.type == TOKEN::ARRAY_CLOSE)
                {
                    hasCompleted = true;
                }
            }
        }
        node->setList(list);
        return node;
    }
    std::shared_ptr<JSON::JSONNode> parseBoolean()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        Token nextToken = tokenizer.getToken();
        node->setBoolean(nextToken.value == "True" ? true : false);
        return node;
    }

    std::shared_ptr<JSON::JSONNode> parseNull()
    {
        std::shared_ptr<JSON::JSONNode> node = std::make_shared<JSON::JSONNode>();
        node->setNull();
        return node;
    }
};

vector<string>
convertToArr(string arr)
{
    try
    {
        arr = regex_replace(arr, regex("\\\\|\\[|]|\"|\\s"), "");

        regex re(",");
        sregex_token_iterator first{arr.begin(), arr.end(), re, -1}, last;
        vector<string> args{first, last};

        return args;
    }
    catch (const exception &e)
    {
        cerr << arr << " is not a valid value of type Array";
        exit(1);
    }
}

int convertToInt(string str)
{
    int i = 0;

    for (char c : str)
    {
        if (c >= '0' && c <= '9')
        {
            i = i * 10 + (c - '0');
        }
        else
        {
            cerr << str << " is not a valid value of type Integer";
            exit(1);
        }
    }

    return i;
}

class Solution {}

template <class T> // primary, just let the string through
T convertArg(const string &arg)
{
    return arg;
}

template <> // specialization for int
int convertArg<int>(const string &arg)
{
    return convertToInt(arg);
}
template <> // specialization for bool
bool convertArg<bool>(const string &arg)
{
    return arg == "true";
}

template <> // specialization for bool
vector<string> convertArg<vector<string>>(const string &arg)
{
    return convertToArr(arg);
}

template <> // specialization for bool
vector<int> convertArg<vector<int>>(const string &arg)
{
    vector<int> temp;

    for (string str : convertToArr(arg))
    {
        temp.push_back(convertToInt(str));
    }

    return temp;
}

namespace detail
{
    template <int... Is>
    struct seq
    {
    };

    template <int N, int... Is>
    struct gen_seq : gen_seq<N - 1, N - 1, Is...>
    {
    };

    template <int... Is>
    struct gen_seq<0, Is...> : seq<Is...>
    {
    };
    template <typename... Ts, int... Is>
    tuple<Ts...> for_each(tuple<Ts...> &t, vector<string> types, vector<string> args, seq<Is...>)
    {
        return make_tuple(
            convertArg<
                tuple_element_t<Is, std::remove_reference_t<decltype(t)>>>(
                args.at(Is))...);
    }
}

template <typename... Ts>
tuple<Ts...> for_each_in_tuple(tuple<Ts...> &t, vector<string> types, vector<string> args)
{
    return detail::for_each(t, types, args, detail::gen_seq<sizeof...(Ts)>());
}

template <typename Tuple, size_t... I>
void process(Tuple &tuple, string returnType, index_sequence<I...>)
{
    string str;
    Solution solution;
    auto output = solution.func_name(get<I>(tuple)...);

    printOutput(output);
}

// The interface to call. Sadly, it needs to dispatch to another function
// to deduce the sequence of indices created from std::make_index_sequence<N>
template <typename Tuple>
void process(Tuple &tuple, string returnType)
{
    process(tuple, returnType, make_index_sequence<tuple_size<Tuple>::value>());
}

template <typename R, typename... T>
auto function_args(R (Solution::*)(T...))
{
    return tuple<remove_reference_t<T>...>();
}

void execute(vector<string> &inputs)
{
    string funcName = inputs[0];
    string returnType = inputs[3];

    JSONParser parser(inputs[1]);
    parser.parse();

    JSON::JSONList params = parser.root->returnList();

    regex re("\n");
    sregex_token_iterator first{inputs[2].begin(), inputs[2].end(), re, -1}, last;
    vector<string> args{first, last};

    vector<string> types;

    for (shared_ptr<JSON::JSONNode> param : params)
    {
        types.push_back(param->returnObject()["type"]->returnString());
    }

    auto convertedArgs = function_args(&Solution::func_name);

    convertedArgs = for_each_in_tuple(convertedArgs, types, args);
    process(convertedArgs, returnType);
}

int main()
{
    string input = "";

    for (std::string line; std::getline(std::cin, line);)
    {
        if (input.size() != 0)
        {
            input += "\n";
        }
        input += line;
    }

    stringstream ss(input);

    vector<string> inputs;
    string word;
    char del = '|';

    while (!ss.eof())
    {
        getline(ss, word, del);
        inputs.push_back(word);
    }

    execute(inputs);

    return 0;
}