## NextJS Azure Function

Ports your nextjs api folder into a single azure function.

## Usage

```shell
npm i nextjs-azure-function
npx nextjs-azure-function
```


## Assumptions
- Your pages/api folder isn't in src (support coming)

## FAQ

**Q: Why do this compile into a single function instead of many?**

**A:** Single function deploys on both AWS and Azure are considered by many to be the best practice, this
particular function implements a "lazy-parse" meaning the only metric that will increase as your application grows
is download time which is normally over azures gigabit network. This solution optimizes for cold starts.

**Q: Does this handle getStaticProps/getInitialProps/...?**

**A:** Not currently, however its pretty easy to support in the future.


## Shoutout
- Huge thanks to the people maintaining the libraries this code relies on.


