import { execSync } from 'child_process';

import inquirer from 'inquirer';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .version('1.0.0')
  .description('Create a demo project')
  .action(async () => {
    console.log(chalk.green('Welcome to create-demo CLI!'));

    // 询问用户选择 demo 项目
    const { repo } = await inquirer.prompt([
      {
        type: 'list',
        name: 'repo',
        message: 'Select a demo to create:',
        choices: [
          {
            name: 'Fixed Layout Demo',
            value: 'https://github.com/dragooncjw/demo-fixed-layout.git',
          },
          { name: 'Free Layout Demo', value: 'https://github.com/dragooncjw/demo-free-layout.git' },
        ],
      },
    ]);

    // 克隆项目
    console.log(chalk.blue(`Cloning ${repo}...`));
    execSync(`git clone ${repo} demo-project`, { stdio: 'inherit' });

    console.log(chalk.green('Demo project created successfully!'));
    console.log(chalk.yellow('Run the following commands to start:'));
    console.log(chalk.cyan('  cd demo-project'));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm start'));
  });

program.parse(process.argv);
