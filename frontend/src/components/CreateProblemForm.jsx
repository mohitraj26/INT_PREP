import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Tabs, 
  Tab, 
  Box, 
  Button, 
  Typography, 
  TextField, 
  MenuItem, 
  IconButton, 
  Paper, 
  Grid,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider
} from "@mui/material";
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon,
  MenuBook as MenuBookIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/Theme";



const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  companyTag: z.array(z.string()).optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  companyTag: ["Microsoft", "Amazon"],
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};

const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  companyTag: ["Amazon", "Microsoft", "Google"],
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
  PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass
  
  # Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()
    
    # Call solution
    sol = Solution()
    result = sol.isPalindrome(s)
    
    # Output result
    print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
  PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Convert to lowercase and keep only alphanumeric characters
        filtered_chars = [c.lower() for c in s if c.isalnum()]
        
        # Check if it's a palindrome
        return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()
    
    # Call solution
    sol = Solution()
    result = sol.isPalindrome(s)
    
    # Output result
    print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: 24 }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const CreateProblemForm = () => {
  const [tab, setTab] = useState(0);
  const [sampleType, setSampleType] = useState("DP");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const { isDarkMode } = useThemeContext();

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      companyTag: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    }
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: companyTagFields,
    append: appendCompanyTag,
    remove: removeCompanyTag,
    replace: replaceCompanyTags,
  } = useFieldArray({
    control,
    name: "companyTag",
  });

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problem/create-problem", value);
      // console.log(res.data);
      toast.success(res.data.message || "Problem Created successfully");
      navigation("/newpage");
    } catch (error) {
      console.log(error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };


  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    // console.log("Loading sample data:", sampleData);

    replaceCompanyTags(sampleData.companyTag.map((tag) => tag));
    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestcases(sampleData.testcases.map((tc) => tc));

    // Reset the form with sample data
    reset(sampleData);
  };

  // Get the theme for Monaco editor
  const getMonacoTheme = () => {
    return isDarkMode ? 'vs-dark' : 'vs';
  };


  return (
  <Box sx={{ maxWidth: 1200, mx: "auto", my: 4, p: 3 }}>
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Create New Problem</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sample Type</InputLabel>
          <Select
            value={sampleType}
            onChange={(e) => setSampleType(e.target.value)}
            label="Sample Type"
          >
            <MenuItem value="DP">Dynamic Programming</MenuItem>
            <MenuItem value="String">String Problem</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={loadSampleData}
          startIcon={<MenuBookIcon />}
        >
          Load Sample
        </Button>
      </Box>
    </Paper>

    <Paper elevation={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Problem Form Tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Basic Info" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Test Cases" icon={<CheckCircleIcon />} iconPosition="start" />
          <Tab label="JS Code & Solution" icon={<CodeIcon />} iconPosition="start" />
          <Tab label="Python Code & Solution" icon={<CodeIcon />} iconPosition="start" />
          <Tab label="Java Code & Solution" icon={<CodeIcon />} iconPosition="start" />
          <Tab label="Additional Info" icon={<LightbulbIcon />} iconPosition="start" />
        </Tabs>

        {/* 1. Basic Info */}
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" sx={{ mb: 3 }}>Title, Description, Difficulty, Tags</Typography>
          
          <Grid container spacing={2} display={"flex"} flexDirection={"column"}>
            <Grid>
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            
            <Grid>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            
            <Grid>
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  label="Difficulty"
                  value={watch('difficulty') ?? ''}
                  onChange={e => setValue('difficulty', e.target.value)}
                  {...register("difficulty")}
                >
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </Select>
                {errors.difficulty && <FormHelperText>{errors.difficulty.message}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Tags</Typography>
              {tagFields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', mb: 1, gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Tag ${index + 1}`}
                    {...register(`tags.${index}`)}
                    error={!!errors.tags?.[index]}
                    helperText={errors.tags?.[index]?.message}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeTag(index)}
                    disabled={tagFields.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => appendTag("")}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Tag
              </Button>
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Company Tags</Typography>
              {companyTagFields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', mb: 1, gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Company ${index + 1}`}
                    {...register(`companyTag.${index}`)}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeCompanyTag(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => appendCompanyTag("")}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Company
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* 2. Test Cases */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>Test Cases</Typography>
          
          {testCaseFields.map((field, index) => (
            <Paper key={field.id} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">Test Case {index + 1}</Typography>
                <IconButton 
                  color="error" 
                  onClick={() => removeTestCase(index)}
                  disabled={testCaseFields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Input"
                    multiline
                    rows={3}
                    {...register(`testcases.${index}.input`)}
                    error={!!errors.testcases?.[index]?.input}
                    helperText={errors.testcases?.[index]?.input?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Output"
                    multiline
                    rows={3}
                    {...register(`testcases.${index}.output`)}
                    error={!!errors.testcases?.[index]?.output}
                    helperText={errors.testcases?.[index]?.output?.message}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => appendTestCase({ input: "", output: "" })}
            variant="contained"
            sx={{ mt: 1 }}
          >
            Add Test Case
          </Button>
        </TabPanel>

        {/* 3. JS Code & Solution */}
        <TabPanel value={tab} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>JavaScript Starter Code & Reference Solution</Typography>
          
          <Grid container spacing={3} display={"flex"} flexDirection={"column"}>
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Example</Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Input"
                    multiline
                    rows={3}
                    {...register("examples.JAVASCRIPT.input")}
                    error={!!errors.examples?.JAVASCRIPT?.input}
                    helperText={errors.examples?.JAVASCRIPT?.input?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Output"
                    multiline
                    rows={3}
                    {...register("examples.JAVASCRIPT.output")}
                    error={!!errors.examples?.JAVASCRIPT?.output}
                    helperText={errors.examples?.JAVASCRIPT?.output?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Explanation"
                    multiline
                    rows={3}
                    {...register("examples.JAVASCRIPT.explanation")}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Starter Code</Typography>
              <Controller
                name="codeSnippets.JAVASCRIPT"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="javascript"
                    theme={getMonacoTheme()}
                    value={field.value}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.codeSnippets?.JAVASCRIPT && (
                <FormHelperText error>{errors.codeSnippets.JAVASCRIPT.message}</FormHelperText>
              )}
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Reference Solution</Typography>
              <Controller
                name="referenceSolutions.JAVASCRIPT"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="javascript"
                    value={field.value}
                    theme={getMonacoTheme()}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.referenceSolutions?.JAVASCRIPT && (
                <FormHelperText error>{errors.referenceSolutions.JAVASCRIPT.message}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* 4. Python Code & Solution */}
        <TabPanel value={tab} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>Python Starter Code & Reference Solution</Typography>
          
          <Grid container spacing={3} display={"flex"} flexDirection={"column"}>
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Example</Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Input"
                    multiline
                    rows={3}
                    {...register("examples.PYTHON.input")}
                    error={!!errors.examples?.PYTHON?.input}
                    helperText={errors.examples?.PYTHON?.input?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Output"
                    multiline
                    rows={3}
                    {...register("examples.PYTHON.output")}
                    error={!!errors.examples?.PYTHON?.output}
                    helperText={errors.examples?.PYTHON?.output?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Explanation"
                    multiline
                    rows={3}
                    {...register("examples.PYTHON.explanation")}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Starter Code</Typography>
              <Controller
                name="codeSnippets.PYTHON"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="python"
                    value={field.value}
                    theme={getMonacoTheme()}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.codeSnippets?.PYTHON && (
                <FormHelperText error>{errors.codeSnippets.PYTHON.message}</FormHelperText>
              )}
            </Grid>
            
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Reference Solution</Typography>
              <Controller
                name="referenceSolutions.PYTHON"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="python"
                    value={field.value}
                    theme={getMonacoTheme()}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.referenceSolutions?.PYTHON && (
                <FormHelperText error>{errors.referenceSolutions.PYTHON.message}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* 5. Java Code & Solution */}
        <TabPanel value={tab} index={4} >
          <Typography variant="h6" sx={{ mb: 3 }}>Java Starter Code & Reference Solution</Typography>
          
          <Grid container spacing={3} display={"flex"} flexDirection={"column"}>
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Example</Typography>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Input"
                    multiline
                    rows={3}
                    {...register("examples.JAVA.input")}
                    error={!!errors.examples?.JAVA?.input}
                    helperText={errors.examples?.JAVA?.input?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Output"
                    multiline
                    rows={3}
                    {...register("examples.JAVA.output")}
                    error={!!errors.examples?.JAVA?.output}
                    helperText={errors.examples?.JAVA?.output?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Explanation"
                    multiline
                    rows={3}
                    {...register("examples.JAVA.explanation")}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3} display={"flex"} flexDirection={"column"}>
            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Starter Code</Typography>
              <Controller
                name="codeSnippets.JAVA"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="java"
                    value={field.value}
                    theme={getMonacoTheme()}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.codeSnippets?.JAVA && (
                <FormHelperText error>{errors.codeSnippets.JAVA.message}</FormHelperText>
              )}
            </Grid>

            <Grid>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Reference Solution</Typography>
              <Controller
                name="referenceSolutions.JAVA"
                control={control}
                render={({ field }) => (
                  <Editor
                    height="300px"
                    language="java"
                    value={field.value}
                    theme={getMonacoTheme()}
                    onChange={field.onChange}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                )}
              />
              {errors.referenceSolutions?.JAVA && (
                <FormHelperText error>{errors.referenceSolutions.JAVA.message}</FormHelperText>
              )}
            </Grid>
          </Grid>

          </Grid>
        </TabPanel>
        {/* 6. Additional Info */}
        <TabPanel value={tab} index={5}>
          <Typography variant="h6" sx={{ mb: 3 }}>Additional Information</Typography>
          
          <Grid container spacing={3} display={"flex"} flexDirection={"column"}>
            <Grid>
              <TextField
                fullWidth
                label="Constraints"
                multiline
                rows={3}
                {...register("constraints")}
                error={!!errors.constraints}
                helperText={errors.constraints?.message}
              />
            </Grid>
            
            <Grid>
              <TextField
                fullWidth
                label="Hints"
                multiline
                rows={3}
                {...register("hints")}
              />
            </Grid>
            
            <Grid>
              <TextField
                fullWidth
                label="Editorial"
                multiline
                rows={5}
                {...register("editorial")}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <Box sx={{ display: "flex", justifyContent: "space-between", p: 3, borderTop: 1, borderColor: "divider" }}>
          <Button 
            variant="outlined" 
            onClick={() => setTab(prev => Math.max(0, prev - 1))}
            disabled={tab === 0}
          >
            Previous
          </Button>
  
          {tab < 5 ? (
            <Button 
              variant="contained" 
              onClick={() => setTab(prev => Math.min(5, prev + 1))}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Problem"}
            </Button>
          )}
        </Box>

      </form>
    </Paper>
  </Box>
);

};

export default CreateProblemForm;
