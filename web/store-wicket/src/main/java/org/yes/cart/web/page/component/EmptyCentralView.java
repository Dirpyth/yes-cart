/*
 * Copyright 2009 Inspire-Software.com
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package org.yes.cart.web.page.component;

import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.spring.injection.annot.SpringBean;
import org.yes.cart.domain.entity.Seoable;
import org.yes.cart.search.dto.NavigationContext;
import org.yes.cart.web.support.constants.StorefrontServiceSpringKeys;
import org.yes.cart.web.support.service.ContentServiceFacade;

import java.util.HashMap;
import java.util.Map;

/**
 * User: Igor Azarny iazarny@yahoo.com
 * Date: 7/13/11
 * Time: 9:04 AM
 */
public class EmptyCentralView extends AbstractCentralView {

    @SpringBean(name = StorefrontServiceSpringKeys.CONTENT_SERVICE_FACADE)
    private ContentServiceFacade contentServiceFacade;

    /**
     * Construct panel.
     *
     * @param id panel id
     * @param navigationContext navigation context.
     */
    public EmptyCentralView(final String id, final NavigationContext navigationContext) {
        super(id, 0L, navigationContext);
    }

    /**
     * This is an internal constructor used by HomePage class. It disregards the
     * categoryId value.
     *
     * @param id panel id
     * @param categoryId ignored
     * @param navigationContext navigation context.
     */
    public EmptyCentralView(final String id, final long categoryId, final NavigationContext navigationContext) {
        super(id, 0L, navigationContext);
    }


    @Override
    protected void onBeforeRender() {

        final String lang = getLocale().getLanguage();

        add(new TopCategories("topCategories"));

        String footerCopyright = getContentInclude(getCurrentShopId(), "homepage_content_include", lang);
        addOrReplace(new Label("homepageContent", footerCopyright).setEscapeModelStrings(false));

        super.onBeforeRender();
    }

    private String getContentInclude(long shopId, String contentUri, String lang) {
        final Map<String, Object> homepageCtx = new HashMap<>();
        homepageCtx.put("shop", getCurrentShop());
        homepageCtx.put("shoppingCart", getCurrentCart());
        String content = contentServiceFacade.getDynamicContentBody(
                contentUri, shopId, lang, homepageCtx);
        if (content == null) {
            content = "";
        }
        return content;
    }

    @Override
    protected Seoable getSeoObject() {
        return null;
    }
}
