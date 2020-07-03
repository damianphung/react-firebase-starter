
import db from '../db';

/**
 * Finds a user matching the provided Passport.js credentials. If user not
 * found, it attempts to create a new user account.
 */
export async function upsertPage(profile, user, userPageInfoList) {

  if ( profile.provider !== 'facebook' ){
      console.log("upsertPage::Provider not yet supported - " , profile.provider);
      return user;
  }

  for ( const pageInfo of userPageInfoList.data ) {
      console.log("page element ", pageInfo);
      let pageId = pageInfo.id;
      let pageAccessToken = { "access_token" : pageInfo.access_token }; 

      const identityKeys = {
        'facebook_page_information.user_id': user.id,
        'facebook_page_information.page_id': pageId,
      };

      let page = await db
        .table('facebook_page_information')
        .where(identityKeys)
        .select('facebook_page_information.*') 
        .first();

      console.log("finished fisrt query");
      if (page) {
          console.log("is page");
        await db
          .table('facebook_page_information')
          .where(identityKeys)
          .update({
              credentials: JSON.stringify(pageAccessToken),
           });
        
      } else {
        [page] = await db
        .table('facebook_page_information')
        .insert({
          user_id: user.id,
          page_id: pageId,
          credentials: JSON.stringify(pageAccessToken)
        })
        .returning('*');
      }
  };
  
  return user;
}
