module.exports = {
    branches: ['master'],
    tagFormat: 'v${version}',
    repositoryUrl: 'https://github.com/rmi22186/test-semantic-release',
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'angular',
            },
        ],
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        ['@semantic-release/npm'],
        [
            '@semantic-release/exec',
            {
                prepareCmd: 'sh ./scripts/release.sh',
            },
        ],
        [
            '@semantic-release/github',
            {
                assets: ['indx.js'],
            },
        ],
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
                message:
                    'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
    ],
};
