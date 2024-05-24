import java.util.Scanner;
import java.util.regex.Pattern;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.regex.Matcher;
// Import statements here

/**
 * Test
 */
public class Main {
    public static void main(String[] args) throws NoSuchMethodException, SecurityException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException {
        Scanner scanner = new Scanner(System.in);
        String input = "";

        while (scanner.hasNextLine()) {
            if (input.length() != 0) {
                input += "\n";
            }
            input += scanner.nextLine();
        }

        String[] inputs = input.split(Pattern.quote("|"), 0);

        execute(inputs);

        scanner.close();
    }

    public static String[] convertMatrixString(String list) throws Exception {
        if (list.charAt(0) != '[' || list.charAt(list.length() - 1) != ']') {
            throw new Exception("");
        }

        ArrayList<String> allMatches = new ArrayList<String>();
        Matcher m = Pattern.compile("\\[.+?]")
            .matcher(list);
        while (m.find()) {
          allMatches.add(m.group());
        }

        String[] res = new String[allMatches.size()];
        for (int i = 0; i < allMatches.size(); i++) res[i] = allMatches.get(i);
        return res;
    }

    public static String[] convertToArray(String list) throws Exception {
        if (list.charAt(0) != '[' || list.charAt(list.length() - 1) != ']') {
            throw new Exception("");
        }
        return list.replaceAll("\\\\|\"|\'|\\[|]|\\s", "").split(",");
    }

    public static int[] convertIntArray(String[] strings) {
        int[] temp = new int[strings.length];
        for (int i = 0; i < temp.length; i++) {
            temp[i] = Integer.parseInt(strings[i]);
        }
        return temp;
    }

    public static int[][] convertIntMatrix(String[] strings) throws Exception {
        int[][] temp = new int[convertToArray(strings[0]).length][strings.length];
        for (int i = 0; i < temp.length; i++) {
            temp[i] = convertIntArray(convertToArray(strings[i]));
        }
        return temp;
    }

    public static Object convertArg(String type, String arg) {
        try {
            String[] convertedArray;
            String[][] temp;

            switch (type) {
                case "String[][]":
                    convertedArray = convertMatrixString(arg);
                    temp = new String[convertToArray(convertedArray[0]).length][convertedArray.length];
                    for (int i = 0; i < convertedArray.length; i++) {
                        temp[i] = convertToArray(convertedArray[i]);
                    }
                    return temp;
                case "Integer[][]":
                    return convertIntMatrix(convertMatrixString(arg));
                case "Integer[]":
                    return convertIntArray(convertToArray(arg));
                case "String[]":
                    return convertToArray(arg);
                case "Integer":
                    return Integer.parseInt(arg);
                case "Boolean":
                    return arg == "true" ? true : false;
                default:
                    return arg;
            }
        } catch (Exception e) {
            System.err.println(String.format("%s is not a valid value of type %s", arg, type));
            System.exit(1);
            return false;
        }
    }

    public static void printOutput(Object output) {
        Class outputClass = output.getClass();
        String[] stringifiedArrays;

        if (outputClass == int[].class) {
            System.out.print(Arrays.toString(((int[]) output)).replaceAll("\\s", ""));
        } else if (outputClass == String[].class) {
            System.out.print(Arrays.toString(((String[]) output)).replaceAll("\\s", ""));
        } else if (outputClass == int[][].class) {
            stringifiedArrays = new String[((int[][]) output).length];
            for (int i = 0; i < stringifiedArrays.length; i++) {
                stringifiedArrays[i] = Arrays.toString(((int[][]) output)[i]);
            }
            System.out.print(Arrays.toString(stringifiedArrays).replaceAll("\\s", ""));
        } else if (outputClass == String[][].class) {
            stringifiedArrays = new String[((String[][]) output).length];
            for (int i = 0; i < stringifiedArrays.length; i++) {
                stringifiedArrays[i] = Arrays.toString(((String[][]) output)[i]);
            }
            System.out.print(Arrays.toString(stringifiedArrays).replaceAll("\\s", ""));
        } else {
            System.out.print(output);
        }
    }

    public static void execute(String[] inputs) throws NoSuchMethodException, SecurityException, IllegalAccessException,
            IllegalArgumentException, InvocationTargetException {
        String funcName = inputs[0];
        JSONArray params = new JSONArray(inputs[1].replaceAll(Pattern.quote("\\"), ""));
        String[] args = inputs[2].split(Pattern.quote("\n"), 0);

        Object[] convertedArgs = new Object[args.length];
        @SuppressWarnings("rawtypes")
        Class[] argsClasses = new Class[args.length];

        for (int i = 0; i < args.length; i++) {
            String type = params.getJSONObject(i).getValue("type");
            convertedArgs[i] = convertArg(type, args[i]);
        }

        Solution solution = new Solution();
        @SuppressWarnings("rawtypes")
        Class cls = Solution.class;
        Class[] paramTypes;

        for (Method field : cls.getMethods()) {
            if (!field.getName().equals(funcName)) {
                continue;
            }
            paramTypes = field.getParameterTypes();
            for (int i = 0; i < argsClasses.length; i++) {
                argsClasses[i] = paramTypes[i];
            }
            break;
        }

        @SuppressWarnings("unchecked")
        Method method = cls.getDeclaredMethod(funcName, argsClasses);
        printOutput(method.invoke(solution, convertedArgs));
    }
}

class Solution {}

// Defining constants for json parsers
enum CONSTANTS {

    CURLY_OPEN_BRACKETS('{'),
    CURLY_CLOSE_BRACKETS('}'),
    SQUARE_OPEN_BRACKETS('['),
    SQUARE_CLOSE_BRACKETS(']'),
    COLON(':'),
    COMMA(','),
    SPECIAL('|');

    private final char constant;

    // Constructor
    CONSTANTS(char constant) {
        this.constant = constant;
    }

    // Method
    // Overriding exiting toString() method
    @Override
    public String toString() {
        return String.valueOf(constant);
    }
}

// Class 1
// To parse json object
class JSONObject {

    private final static char specialChar;
    private final static char commaChar;
    private HashMap<String, String> objects;

    static {
        specialChar = String.valueOf(CONSTANTS.SPECIAL)
                .toCharArray()[0];
        commaChar = String.valueOf(CONSTANTS.COMMA)
                .toCharArray()[0];
    }

    // Constructor if this class
    public JSONObject(String arg) {
        getJSONObjects(arg);
    }

    // Method 1
    // Storing json objects as key value pair in hash map
    public void getJSONObjects(String arg) {

        objects = new HashMap<String, String>();

        if (arg.startsWith(String.valueOf(
                CONSTANTS.CURLY_OPEN_BRACKETS))
                && arg.endsWith(String.valueOf(
                        CONSTANTS.CURLY_CLOSE_BRACKETS))) {

            StringBuilder builder = new StringBuilder(arg);
            builder.deleteCharAt(0);
            builder.deleteCharAt(builder.length() - 1);
            builder = replaceCOMMA(builder);

            for (String objects : builder.toString().split(
                    String.valueOf(CONSTANTS.COMMA))) {

                String[] objectValue = objects.split(
                        String.valueOf(CONSTANTS.COLON), 2);

                if (objectValue.length == 2)
                    this.objects.put(
                            objectValue[0]
                                    .replace("'", "")
                                    .replace("\"", ""),
                            objectValue[1]
                                    .replace("'", "")
                                    .replace("\"", ""));
            }
        }
    }

    // Method 2
    public StringBuilder replaceCOMMA(StringBuilder arg) {

        boolean isJsonArray = false;

        for (int i = 0; i < arg.length(); i++) {
            char a = arg.charAt(i);

            if (isJsonArray) {

                if (String.valueOf(a).compareTo(
                        String.valueOf(CONSTANTS.COMMA)) == 0) {
                    arg.setCharAt(i, specialChar);
                }
            }

            if (String.valueOf(a).compareTo(String.valueOf(
                    CONSTANTS.SQUARE_OPEN_BRACKETS)) == 0)
                isJsonArray = true;
            if (String.valueOf(a).compareTo(String.valueOf(
                    CONSTANTS.SQUARE_CLOSE_BRACKETS)) == 0)
                isJsonArray = false;
        }

        return arg;
    }

    // Method 3
    // Getting json object value by key from hash map
    public String getValue(String key) {
        if (objects != null) {
            return objects.get(key).replace(specialChar,
                    commaChar);
        }
        return null;
    }

    // Method 4
    // Getting json array by key from hash map
    public JSONArray getJSONArray(String key) {
        if (objects != null)
            return new JSONArray(
                    objects.get(key).replace('|', ','));
        return null;
    }
}

// Class 2
// To parse json array
class JSONArray {

    private final static char specialChar;
    private final static char commaChar;

    public ArrayList<String> objects;

    static {
        specialChar = String.valueOf(CONSTANTS.SPECIAL)
                .toCharArray()[0];
        commaChar = String.valueOf(CONSTANTS.COMMA)
                .toCharArray()[0];
    }

    // Constructor of this class
    public JSONArray(String arg) {
        getJSONObjects(arg);
    }

    // Method 1
    // Storing json objects in array list
    public void getJSONObjects(String arg) {

        objects = new ArrayList<String>();

        if (arg.startsWith(String.valueOf(
                CONSTANTS.SQUARE_OPEN_BRACKETS))
                && arg.endsWith(String.valueOf(
                        CONSTANTS.SQUARE_CLOSE_BRACKETS))) {

            StringBuilder builder = new StringBuilder(arg);

            builder.deleteCharAt(0);
            builder.deleteCharAt(builder.length() - 1);

            builder = replaceCOMMA(builder);

            // Adding all elements
            // using addAll() method of Collections class
            Collections.addAll(
                    objects,
                    builder.toString().split(
                            String.valueOf(CONSTANTS.COMMA)));
        }
    }

    // Method 2
    public StringBuilder replaceCOMMA(StringBuilder arg) {
        boolean isArray = false;

        for (int i = 0; i < arg.length(); i++) {
            char a = arg.charAt(i);
            if (isArray) {

                if (String.valueOf(a).compareTo(
                        String.valueOf(CONSTANTS.COMMA)) == 0) {
                    arg.setCharAt(i, specialChar);
                }
            }

            if (String.valueOf(a).compareTo(String.valueOf(
                    CONSTANTS.CURLY_OPEN_BRACKETS)) == 0)
                isArray = true;

            if (String.valueOf(a).compareTo(String.valueOf(
                    CONSTANTS.CURLY_CLOSE_BRACKETS)) == 0)
                isArray = false;
        }

        return arg;
    }

    // Method 3
    // Getting json object by index from array list
    public String getObject(int index) {
        if (objects != null) {
            return objects.get(index).replace(specialChar,
                    commaChar);
        }

        return null;
    }

    // Method 4
    // Getting json object from array list
    public JSONObject getJSONObject(int index) {

        if (objects != null) {
            return new JSONObject(
                    objects.get(index).replace('|', ','));
        }

        return null;
    }
}